/**
 * PayPal REST v2 endpoints.
 *
 * - POST /payments/paypal/create-order — create a PayPal order for an internal order
 * - POST /payments/paypal/capture      — capture an approved PayPal order
 * - POST /payments/paypal/webhook      — receive PayPal webhook events
 */

import { notifyOrderPaid } from '../../../lib/order-notifications.js';
import { finalizePaidOrder } from '../../../lib/finalize-paid-order.js';
import { logSecurityEvent } from '../../../lib/security-events.js';

// Verifies an incoming PayPal webhook against PayPal's own
// verify-webhook-signature endpoint (POST /v1/notifications/verify-webhook-signature)
// using the PAYPAL-* transmission headers PayPal sends with every webhook
// call, plus the webhook ID configured in the PayPal developer dashboard.
// See C2 in the security review — this route previously trusted any POST
// body with no verification at all.
async function verifyPaypalWebhookSignature(fastify, request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    return { verified: false, reason: 'PAYPAL_WEBHOOK_ID is not configured' };
  }

  const h = request.headers;
  const payload = {
    auth_algo: h['paypal-auth-algo'],
    cert_url: h['paypal-cert-url'],
    transmission_id: h['paypal-transmission-id'],
    transmission_sig: h['paypal-transmission-sig'],
    transmission_time: h['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: request.body
  };

  if (
    !payload.auth_algo ||
    !payload.cert_url ||
    !payload.transmission_id ||
    !payload.transmission_sig ||
    !payload.transmission_time
  ) {
    return { verified: false, reason: 'Missing PayPal transmission headers' };
  }

  try {
    const res = await fastify.payments.paypal.fetch(
      '/v1/notifications/verify-webhook-signature',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    if (res.ok && res.data?.verification_status === 'SUCCESS') {
      return { verified: true };
    }
    return { verified: false, reason: res.data?.verification_status || `HTTP ${res.status}` };
  } catch (err) {
    return { verified: false, reason: err.message };
  }
}

const createOrderBody = {
  type: 'object',
  required: ['orderId'],
  properties: {
    orderId: { type: 'string', minLength: 1, maxLength: 64 },
    returnUrl: { type: 'string', maxLength: 500 },
    cancelUrl: { type: 'string', maxLength: 500 }
  },
  additionalProperties: false
};

const captureBody = {
  type: 'object',
  required: ['paypalOrderId'],
  properties: {
    paypalOrderId: { type: 'string', minLength: 1, maxLength: 64 }
  },
  additionalProperties: false
};

function fmt(amount, currency) {
  return { currency_code: currency || 'USD', value: Number(amount).toFixed(2) };
}

export default async function (fastify) {
  fastify.post(
    '/create-order',
    { schema: { body: createOrderBody } },
    async (request, reply) => {
      const { orderId, returnUrl, cancelUrl } = request.body;
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

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: order.id,
            amount: fmt(order.total, order.currency)
          }
        ],
        application_context: {
          brand_name: 'Soko Africa',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl
        }
      };

      let res;
      try {
        res = await fastify.payments.paypal.fetch('/v2/checkout/orders', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        request.log.error({ err }, 'PayPal create order failed');
        return reply.code(err.statusCode || 502).send({
          statusCode: err.statusCode || 502,
          error: 'Bad Gateway',
          message: err.message
        });
      }

      if (!res.ok) {
        request.log.error({ res: res.data }, 'PayPal create-order non-2xx');
        return reply
          .code(502)
          .send({ statusCode: 502, error: 'Bad Gateway', message: 'PayPal error' });
      }

      const paypalOrderId = res.data.id;
      const approveLink = (res.data.links || []).find((l) => l.rel === 'approve');

      await fastify.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'PAYPAL',
          providerRef: paypalOrderId,
          status: 'INITIATED',
          amount: Number(order.total).toFixed(2),
          currency: order.currency || 'USD',
          rawPayload: { create: res.data }
        }
      });

      return reply.send({
        paypalOrderId,
        approveUrl: approveLink?.href || null,
        status: res.data.status
      });
    }
  );

  fastify.post(
    '/capture',
    { schema: { body: captureBody } },
    async (request, reply) => {
      const { paypalOrderId } = request.body;
      const payment = await fastify.prisma.payment.findFirst({
        where: { providerRef: paypalOrderId, provider: 'PAYPAL' }
      });
      if (!payment) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Payment not found for that PayPal order id'
        });
      }

      let res;
      try {
        res = await fastify.payments.paypal.fetch(
          `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
          { method: 'POST', body: '{}' }
        );
      } catch (err) {
        request.log.error({ err }, 'PayPal capture failed');
        return reply.code(err.statusCode || 502).send({
          statusCode: err.statusCode || 502,
          error: 'Bad Gateway',
          message: err.message
        });
      }

      const captureStatus = res.data?.status; // COMPLETED on success
      const success = res.ok && captureStatus === 'COMPLETED';

      await fastify.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: success ? 'SUCCESS' : 'FAILED',
            rawPayload: { ...((payment.rawPayload) || {}), capture: res.data }
          }
        });
        if (success) {
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: 'PAID' }
          });
        }
      });

      if (success) {
        notifyOrderPaid(fastify, payment.orderId).catch(() => {});
        finalizePaidOrder(fastify, payment.orderId).catch(() => {});
      }

      return reply.send({
        paypalOrderId,
        status: success ? 'SUCCESS' : 'FAILED',
        orderStatus: success ? 'PAID' : undefined,
        orderId: payment.orderId
      });
    }
  );

  // PayPal webhook — signature is verified against PayPal's own
  // verify-webhook-signature endpoint before any event is trusted (see C2).
  fastify.post(
    '/webhook',
    { config: { rateLimit: false } },
    async (request, reply) => {
      const verification = await verifyPaypalWebhookSignature(fastify, request);
      if (!verification.verified) {
        await logSecurityEvent(
          fastify,
          'PAYPAL_WEBHOOK_UNVERIFIED',
          'HIGH',
          { reason: verification.reason, eventType: request.body?.event_type },
          request.ip
        );
        request.log.warn(
          { reason: verification.reason },
          'Rejected unverified PayPal webhook'
        );
        return reply.code(401).send({ statusCode: 401, error: 'Unauthorized' });
      }

      const event = request.body || {};
      request.log.info({ paypal: event.event_type }, 'PayPal webhook received');

      const eventType = event.event_type;
      const resource = event.resource || {};

      if (eventType === 'CHECKOUT.ORDER.APPROVED') {
        // Buyer approved but capture is a separate step we trigger explicitly.
        const paypalOrderId = resource.id;
        if (paypalOrderId) {
          const payment = await fastify.prisma.payment.findFirst({
            where: { providerRef: paypalOrderId, provider: 'PAYPAL' }
          });
          if (payment) {
            await fastify.prisma.payment.update({
              where: { id: payment.id },
              data: {
                rawPayload: { ...((payment.rawPayload) || {}), approved: event }
              }
            });
          }
        }
        return reply.send({ ok: true });
      }

      if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
        const paypalOrderId =
          resource.supplementary_data?.related_ids?.order_id ||
          resource.invoice_id ||
          null;
        if (paypalOrderId) {
          const payment = await fastify.prisma.payment.findFirst({
            where: { providerRef: paypalOrderId, provider: 'PAYPAL' }
          });
          if (payment && payment.status !== 'SUCCESS') {
            await fastify.prisma.$transaction(async (tx) => {
              await tx.payment.update({
                where: { id: payment.id },
                data: {
                  status: 'SUCCESS',
                  rawPayload: { ...((payment.rawPayload) || {}), webhook: event }
                }
              });
              await tx.order.update({
                where: { id: payment.orderId },
                data: { status: 'PAID' }
              });
            });
            notifyOrderPaid(fastify, payment.orderId).catch(() => {});
            finalizePaidOrder(fastify, payment.orderId).catch(() => {});
          }
        }
        return reply.send({ ok: true });
      }

      if (
        eventType === 'PAYMENT.CAPTURE.DENIED' ||
        eventType === 'PAYMENT.CAPTURE.REFUNDED' ||
        eventType === 'CHECKOUT.ORDER.VOIDED'
      ) {
        const paypalOrderId =
          resource.supplementary_data?.related_ids?.order_id || resource.id;
        if (paypalOrderId) {
          const payment = await fastify.prisma.payment.findFirst({
            where: { providerRef: paypalOrderId, provider: 'PAYPAL' }
          });
          if (payment) {
            const next = eventType === 'PAYMENT.CAPTURE.REFUNDED' ? 'REFUNDED' :
                          eventType === 'CHECKOUT.ORDER.VOIDED' ? 'CANCELLED' : 'FAILED';
            await fastify.prisma.$transaction(async (tx) => {
              await tx.payment.update({
                where: { id: payment.id },
                data: {
                  status: next,
                  rawPayload: { ...((payment.rawPayload) || {}), webhook: event }
                }
              });
              await tx.order.update({
                where: { id: payment.orderId },
                data: { status: next === 'REFUNDED' ? 'REFUNDED' : next === 'CANCELLED' ? 'CANCELLED' : 'FAILED' }
              });
            });
          }
        }
        return reply.send({ ok: true });
      }

      return reply.send({ ok: true });
    }
  );
}
