/**
 * Safaricom M-Pesa STK Push (Daraja) endpoints.
 * - POST   /payments/mpesa/stk                 — start (or reuse) an STK push
 * - POST   /payments/mpesa/callback            — Daraja result webhook
 * - GET    /payments/mpesa/status/:checkoutId  — poll a payment's status
 */

import { timingSafeEqual } from 'crypto';
import { notifyOrderPaid } from '../../../lib/order-notifications.js';
import { finalizePaidOrder } from '../../../lib/finalize-paid-order.js';
import { logSecurityEvent } from '../../../lib/security-events.js';
import {
  assertOrderPaymentAccess,
  resolveAuthedUserId
} from '../../../lib/order-access.js';
import {
  fromMinor,
  roundToProviderGranularity,
  toMinor
} from '../../../lib/money.js';

// Cents-level tolerance when comparing the amount Daraja says was actually
// paid against the order total, to absorb currency-rounding differences.
const AMOUNT_TOLERANCE = 0.01;

/** How long an INITIATED STK is reused instead of firing a second phone prompt. */
const OPEN_STK_REUSE_MS = 2 * 60 * 1000;

const OPEN_PAYMENT_STATUSES = ['PENDING', 'INITIATED'];
const TERMINAL_PAYMENT_STATUSES = ['SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'];

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a || ''));
  const bufB = Buffer.from(String(b || ''));
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function normalizeKenyanPhone(input) {
  if (!input) return null;
  let s = String(input).replace(/\s|-|\(|\)|\+/g, '');
  if (s.startsWith('07') || s.startsWith('01')) {
    s = '254' + s.slice(1);
  } else if (s.startsWith('7') || s.startsWith('1')) {
    s = '254' + s;
  }
  if (!/^2547\d{8}$|^2541\d{8}$/.test(s)) return null;
  return s;
}

function resultCodeToStatus(code) {
  const n = Number(code);
  if (n === 0) return 'SUCCESS';
  if (n === 1032) return 'CANCELLED';
  return 'FAILED';
}

function serializeStkResponse(payment, extras = {}) {
  return {
    checkoutRequestId: payment.providerRef,
    merchantRequestId: extras.merchantRequestId || payment.rawPayload?.response?.MerchantRequestID || null,
    customerMessage:
      extras.customerMessage ||
      payment.rawPayload?.response?.CustomerMessage ||
      'Payment prompt sent',
    status: payment.status,
    orderId: payment.orderId,
    reused: Boolean(extras.reused)
  };
}

const stkBody = {
  type: 'object',
  required: ['orderId', 'phone'],
  properties: {
    orderId: { type: 'string', minLength: 1, maxLength: 64 },
    phone: { type: 'string', minLength: 7, maxLength: 20 },
    /// When true, cancel any open STK and send a fresh prompt (after failure /
    /// timeout). Default false so double-clicks reuse the in-flight push.
    forceNew: { type: 'boolean' }
  },
  additionalProperties: false
};

export default async function (fastify) {
  fastify.post(
    '/stk',
    {
      schema: { body: stkBody },
      config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }
    },
    async (request, reply) => {
      const { orderId, phone, forceNew = false } = request.body;
      const phoneE164 = normalizeKenyanPhone(phone);
      if (!phoneE164) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Provide a Kenyan phone number (e.g. 2547XXXXXXXX)'
        });
      }

      const authedUserId = await resolveAuthedUserId(request);
      const orderPreview = await fastify.prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, status: true, total: true, currency: true, userId: true }
      });
      if (!assertOrderPaymentAccess(orderPreview, authedUserId, reply)) return;

      // Serialize STK starts per order so two parallel clicks cannot both
      // call Daraja and create two chargeable prompts.
      const outcome = await fastify.prisma.$transaction(async (tx) => {
        const locked = await tx.$queryRaw`
          SELECT id, status, total, currency, "userId"
          FROM "Order"
          WHERE id = ${orderId}
          FOR UPDATE
        `;
        const order = locked?.[0];
        if (!order) return { kind: 'not_found' };

        if (order.status === 'PAID') {
          return { kind: 'already_paid' };
        }
        if (['CANCELLED', 'REFUNDED'].includes(order.status)) {
          return { kind: 'not_payable', status: order.status };
        }

        const openPayments = await tx.payment.findMany({
          where: {
            orderId: order.id,
            provider: 'MPESA',
            status: { in: OPEN_PAYMENT_STATUSES }
          },
          orderBy: { createdAt: 'desc' }
        });

        const freshOpen = openPayments.find(
          (p) =>
            p.providerRef &&
            Date.now() - new Date(p.createdAt).getTime() < OPEN_STK_REUSE_MS
        );

        if (freshOpen && !forceNew) {
          return { kind: 'reuse', payment: freshOpen, order };
        }

        if (forceNew || openPayments.length) {
          await tx.payment.updateMany({
            where: {
              orderId: order.id,
              provider: 'MPESA',
              status: { in: OPEN_PAYMENT_STATUSES }
            },
            data: { status: 'CANCELLED' }
          });
        }

        return { kind: 'launch', order };
      });

      if (outcome.kind === 'not_found') {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found'
        });
      }
      if (outcome.kind === 'already_paid') {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'Order already paid'
        });
      }
      if (outcome.kind === 'not_payable') {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: `Order cannot be paid (status: ${outcome.status})`
        });
      }
      if (outcome.kind === 'reuse') {
        return reply.send(
          serializeStkResponse(outcome.payment, {
            reused: true,
            customerMessage: 'A payment prompt is already on your phone'
          })
        );
      }

      // Daraja settles in whole shillings (`plugins/payments.js` rounds the
      // Amount it sends), so the figure we reconcile the callback against has
      // to be rounded the same way. Storing the unrounded order total here
      // made every non-round total fail the amount check below and leave a
      // genuinely paid order stuck — which fractional weight quantities would
      // turn from a rare edge case into the normal path.
      const currency = outcome.order.currency || 'KES';
      const amount = fromMinor(
        roundToProviderGranularity(
          toMinor(outcome.order.total, currency),
          currency,
          'MPESA'
        ),
        currency
      );

      // Reserve the single open M-Pesa slot before calling Daraja so a second
      // concurrent click cannot also fire a phone prompt.
      let reserved;
      try {
        reserved = await fastify.prisma.payment.create({
          data: {
            orderId: outcome.order.id,
            provider: 'MPESA',
            providerRef: null,
            status: 'INITIATED',
            amount: amount.toFixed(2),
            currency,
            rawPayload: { request: { phone: phoneE164, amount }, reservedAt: new Date().toISOString() }
          }
        });
      } catch (e) {
        if (e?.code === 'P2002') {
          const existing = await fastify.prisma.payment.findFirst({
            where: {
              orderId: outcome.order.id,
              provider: 'MPESA',
              status: { in: OPEN_PAYMENT_STATUSES }
            },
            orderBy: { createdAt: 'desc' }
          });
          if (existing?.providerRef) {
            return reply.send(
              serializeStkResponse(existing, {
                reused: true,
                customerMessage: 'A payment prompt is already on your phone'
              })
            );
          }
        }
        request.log.error({ err: e }, 'Failed to reserve M-Pesa payment slot');
        return reply.code(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Could not start M-Pesa payment'
        });
      }

      let stk;
      try {
        stk = await fastify.payments.mpesa.stkPush({
          phone: phoneE164,
          amount,
          accountReference: outcome.order.id.slice(0, 12),
          description: 'Soko order'
        });
      } catch (err) {
        await fastify.prisma.payment.update({
          where: { id: reserved.id },
          data: {
            status: 'FAILED',
            rawPayload: {
              ...(reserved.rawPayload || {}),
              error: { message: err.message, at: new Date().toISOString() }
            }
          }
        }).catch(() => {});
        request.log.error({ err }, 'M-Pesa STK push failed');
        return reply.code(err.statusCode || 502).send({
          statusCode: err.statusCode || 502,
          error: 'Bad Gateway',
          message: err.message
        });
      }

      const checkoutRequestId = stk.CheckoutRequestID;
      const merchantRequestId = stk.MerchantRequestID;
      if (!checkoutRequestId) {
        await fastify.prisma.payment.update({
          where: { id: reserved.id },
          data: { status: 'FAILED', rawPayload: { ...(reserved.rawPayload || {}), response: stk } }
        }).catch(() => {});
        return reply.code(502).send({
          statusCode: 502,
          error: 'Bad Gateway',
          message: 'M-Pesa did not return a CheckoutRequestID'
        });
      }

      try {
        const payment = await fastify.prisma.payment.update({
          where: { id: reserved.id },
          data: {
            providerRef: checkoutRequestId,
            status: 'INITIATED',
            rawPayload: {
              request: { phone: phoneE164, amount },
              response: stk
            }
          }
        });

        return reply.send(
          serializeStkResponse(payment, {
            merchantRequestId,
            customerMessage: stk.CustomerMessage || 'Payment prompt sent'
          })
        );
      } catch (e) {
        if (e?.code === 'P2002') {
          const existing = await fastify.prisma.payment.findFirst({
            where: { provider: 'MPESA', providerRef: checkoutRequestId }
          });
          if (existing) {
            await fastify.prisma.payment.update({
              where: { id: reserved.id },
              data: { status: 'CANCELLED' }
            }).catch(() => {});
            return reply.send(
              serializeStkResponse(existing, {
                reused: true,
                customerMessage: 'A payment prompt is already on your phone'
              })
            );
          }
        }
        request.log.error({ err: e }, 'Failed to persist M-Pesa CheckoutRequestID');
        return reply.code(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Could not record M-Pesa payment'
        });
      }
    }
  );

  // Daraja callback. Daraja does not sign these requests, so authenticity is
  // established with a pre-shared secret embedded in the callback URL we
  // registered (see plugins/payments.js) rather than any header/signature
  // check (see C1 in the security review).
  fastify.post(
    '/callback',
    {
      config: { rateLimit: false }
    },
    async (request, reply) => {
      const expectedKey = process.env.MPESA_CALLBACK_SECRET;
      const providedKey = request.query?.key;
      if (!expectedKey || !safeEqual(providedKey, expectedKey)) {
        await logSecurityEvent(
          fastify,
          'MPESA_CALLBACK_UNAUTHORIZED',
          'HIGH',
          { hasKey: !!providedKey },
          request.ip
        );
        request.log.warn('Rejected M-Pesa callback with missing/invalid key');
        return reply.code(401).send({ statusCode: 401, error: 'Unauthorized' });
      }

      const body = request.body || {};
      request.log.info({ daraja: body }, 'Daraja STK callback received');

      const stk = body?.Body?.stkCallback;
      if (!stk) {
        return reply.send({ ResultCode: 0, ResultDesc: 'ignored' });
      }

      const checkoutRequestId = stk.CheckoutRequestID;
      const resultCode = stk.ResultCode;
      let status = resultCodeToStatus(resultCode);

      const payment = await fastify.prisma.payment.findFirst({
        where: { providerRef: checkoutRequestId, provider: 'MPESA' }
      });
      if (!payment) {
        request.log.warn({ checkoutRequestId }, 'Callback for unknown payment');
        return reply.send({ ResultCode: 0, ResultDesc: 'ignored' });
      }

      // Duplicate / late callback for an already-terminal payment: ack only.
      if (TERMINAL_PAYMENT_STATUSES.includes(payment.status)) {
        return reply.send({ ResultCode: 0, ResultDesc: 'already_final' });
      }

      const items = stk.CallbackMetadata?.Item || [];
      const meta = items.reduce((acc, it) => {
        acc[it.Name] = it.Value;
        return acc;
      }, {});

      let amountMismatch = false;
      if (status === 'SUCCESS') {
        const paidAmount = Number(meta.Amount);
        const expectedAmount = Number(payment.amount);
        if (
          !Number.isFinite(paidAmount) ||
          Math.abs(paidAmount - expectedAmount) > AMOUNT_TOLERANCE
        ) {
          amountMismatch = true;
          status = 'FAILED';
          await logSecurityEvent(
            fastify,
            'MPESA_AMOUNT_MISMATCH',
            'HIGH',
            {
              checkoutRequestId,
              orderId: payment.orderId,
              expectedAmount,
              paidAmount
            },
            request.ip
          );
          request.log.error(
            { checkoutRequestId, expectedAmount, paidAmount },
            'M-Pesa callback amount does not match order total — order NOT marked paid, flagged for manual review'
          );
        }
      }

      let markedPaid = false;
      await fastify.prisma.$transaction(async (tx) => {
        const updated = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: { in: OPEN_PAYMENT_STATUSES }
          },
          data: {
            status,
            rawPayload: {
              ...((payment.rawPayload) || {}),
              callback: body,
              meta,
              amountMismatch
            }
          }
        });
        if (updated.count === 0) {
          return;
        }

        if (status === 'SUCCESS') {
          const orderUpdate = await tx.order.updateMany({
            where: {
              id: payment.orderId,
              status: { in: ['PENDING_PAYMENT', 'FAILED'] }
            },
            data: { status: 'PAID' }
          });
          markedPaid = orderUpdate.count > 0;
        } else if (!amountMismatch && (status === 'FAILED' || status === 'CANCELLED')) {
          await tx.order.updateMany({
            where: {
              id: payment.orderId,
              status: 'PENDING_PAYMENT'
            },
            data: { status: status === 'CANCELLED' ? 'CANCELLED' : 'FAILED' }
          });
        }
      });

      if (markedPaid) {
        notifyOrderPaid(fastify, payment.orderId).catch(() => {});
        finalizePaidOrder(fastify, payment.orderId).catch(() => {});
      }

      return reply.send({ ResultCode: 0, ResultDesc: 'accepted' });
    }
  );

  // Read-only poll. Order finalization is owned by the signed callback so
  // unauthenticated clients cannot mark orders paid via status probing.
  fastify.get(
    '/status/:checkoutRequestId',
    { config: { rateLimit: { max: 60, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const { checkoutRequestId } = request.params;
      if (!checkoutRequestId) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'checkoutRequestId required'
        });
      }

      const payment = await fastify.prisma.payment.findFirst({
        where: { providerRef: checkoutRequestId, provider: 'MPESA' },
        include: { order: { select: { id: true, status: true, userId: true } } }
      });
      if (!payment) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Payment not found'
        });
      }

      const authedUserId = await resolveAuthedUserId(request);
      if (!assertOrderPaymentAccess(payment.order, authedUserId, reply)) return;

      return {
        checkoutRequestId,
        status: payment.status,
        orderId: payment.orderId,
        orderStatus: payment.order?.status,
        amount: Number(payment.amount),
        currency: payment.currency
      };
    }
  );
}
