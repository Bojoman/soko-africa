/**
 * Safaricom M-Pesa STK Push (Daraja) endpoints.
 * - GET    /payments/mpesa/status/:checkoutId  — poll a payment's status
 */

import { timingSafeEqual } from 'crypto';
import { notifyOrderPaid } from '../../../lib/order-notifications.js';
import { finalizePaidOrder } from '../../../lib/finalize-paid-order.js';
import { logSecurityEvent } from '../../../lib/security-events.js';

// Cents-level tolerance when comparing the amount Daraja says was actually
// paid against the order total, to absorb currency-rounding differences.
const AMOUNT_TOLERANCE = 0.01;

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

const stkBody = {
  type: 'object',
  required: ['orderId', 'phone'],
  properties: {
    orderId: { type: 'string', minLength: 1, maxLength: 64 },
    phone: { type: 'string', minLength: 7, maxLength: 20 }
    // No client-supplied `amount` — the charge amount is always derived
    // from the order's server-side total (see H2 in the security review).
  },
  additionalProperties: false
};

export default async function (fastify) {
  fastify.post(
    '/stk',
    { schema: { body: stkBody } },
    async (request, reply) => {
      const { orderId, phone } = request.body;
      const phoneE164 = normalizeKenyanPhone(phone);
      if (!phoneE164) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Provide a Kenyan phone number (e.g. 2547XXXXXXXX)'
        });
      }

      const order = await fastify.prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, total: true, currency: true, status: true }
      });
      if (!order) {
        return reply
          .code(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });
      }
      if (order.status === 'PAID') {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'Order already paid'
        });
      }

      // Always charge the server-computed order total — never a
      // client-supplied figure (see H2 in the security review).
      const amount = Number(order.total);

      let stk;
      try {
        stk = await fastify.payments.mpesa.stkPush({
          phone: phoneE164,
          amount,
          accountReference: order.id.slice(0, 12),
          description: 'Soko order'
        });
      } catch (err) {
        request.log.error({ err }, 'M-Pesa STK push failed');
        return reply.code(err.statusCode || 502).send({
          statusCode: err.statusCode || 502,
          error: 'Bad Gateway',
          message: err.message
        });
      }

      const checkoutRequestId = stk.CheckoutRequestID;
      const merchantRequestId = stk.MerchantRequestID;

      await fastify.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'MPESA',
          providerRef: checkoutRequestId,
          status: 'INITIATED',
          amount: amount.toFixed(2),
          currency: order.currency || 'KES',
          rawPayload: { request: { phone: phoneE164, amount }, response: stk }
        }
      });

      return reply.send({
        checkoutRequestId,
        merchantRequestId,
        customerMessage: stk.CustomerMessage || 'Payment prompt sent'
      });
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
        // ack to prevent retries even if shape is unexpected
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

      const items = stk.CallbackMetadata?.Item || [];
      const meta = items.reduce((acc, it) => {
        acc[it.Name] = it.Value;
        return acc;
      }, {});

      // Reconcile the amount Daraja says was actually paid against what we
      // expected (the order total, since /stk no longer accepts a
      // client-supplied amount) before ever marking the order PAID (H2).
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

      await fastify.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status,
            rawPayload: { ...((payment.rawPayload) || {}), callback: body, meta, amountMismatch }
          }
        });
        if (status === 'SUCCESS') {
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' }
          });
        } else if (!amountMismatch && (status === 'FAILED' || status === 'CANCELLED')) {
          // A genuine failure/cancellation from Daraja updates the order.
          // An amount mismatch does NOT — the order is left exactly as it
          // was so a human reviews it rather than the system guessing.
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: status === 'CANCELLED' ? 'CANCELLED' : 'FAILED' }
          });
        }
      });

      if (status === 'SUCCESS') {
        notifyOrderPaid(fastify, payment.orderId).catch(() => {});
        finalizePaidOrder(fastify, payment.orderId).catch(() => {});
      }

      return reply.send({ ResultCode: 0, ResultDesc: 'accepted' });
    }
  );

  fastify.get('/status/:checkoutRequestId', async (request, reply) => {
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
      include: { order: { select: { id: true, status: true } } }
    });
    if (!payment) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Payment not found'
      });
    }

    // If still in flight, query Daraja for the latest result.
    if (payment.status === 'INITIATED' || payment.status === 'PENDING') {
      try {
        const { data, ok } = await fastify.payments.mpesa.stkQuery(
          checkoutRequestId
        );
        if (ok && data && data.ResultCode !== undefined) {
          const status = resultCodeToStatus(data.ResultCode);
          await fastify.prisma.payment.update({
            where: { id: payment.id },
            data: {
              status,
              rawPayload: {
                ...((payment.rawPayload) || {}),
                query: data
              }
            }
          });
          if (status === 'SUCCESS') {
            await fastify.prisma.order.update({
              where: { id: payment.orderId },
              data: { status: 'PAID' }
            });
            notifyOrderPaid(fastify, payment.orderId).catch(() => {});
            finalizePaidOrder(fastify, payment.orderId).catch(() => {});
          }
          payment.status = status;
          payment.order = { ...payment.order, status: status === 'SUCCESS' ? 'PAID' : payment.order.status };
        }
      } catch (err) {
        // Don't fail polling on transient query errors.
        request.log.warn({ err: err.message }, 'STK query failed');
      }
    }

    return {
      checkoutRequestId,
      status: payment.status,
      orderId: payment.orderId,
      orderStatus: payment.order?.status,
      amount: Number(payment.amount),
      currency: payment.currency
    };
  });
}
