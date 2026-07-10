/**
 * Stripe PaymentIntents endpoints.
 */

import { notifyOrderPaid } from '../../../lib/order-notifications.js';
import { finalizePaidOrder } from '../../../lib/finalize-paid-order.js';
import { logSecurityEvent } from '../../../lib/security-events.js';

const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW',
  'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

function toMinorUnits(amount, currency) {
  const cur = (currency || 'USD').toUpperCase();
  if (ZERO_DECIMAL.has(cur)) return Math.round(Number(amount));
  return Math.round(Number(amount) * 100);
}

const createIntentBody = {
  type: 'object',
  required: ['orderId'],
  properties: {
    orderId: { type: 'string', minLength: 1, maxLength: 64 }
  },
  additionalProperties: false
};

export default async function (fastify) {
  function ensureStripe(reply) {
    if (!fastify.payments.stripe) {
      reply.code(503).send({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'Stripe is not configured on the server (STRIPE_SECRET_KEY missing)'
      });
      return false;
    }
    return true;
  }

  fastify.post(
    '/create-intent',
    { schema: { body: createIntentBody } },
    async (request, reply) => {
      if (!ensureStripe(reply)) return;
      const { orderId } = request.body;

      const order = await fastify.prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, total: true, currency: true, status: true, email: true }
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

      const amount = toMinorUnits(order.total, order.currency);
      const currency = (order.currency || 'USD').toLowerCase();

      // Reuse an existing INITIATED Stripe payment for this order if present.
      const existing = await fastify.prisma.payment.findFirst({
        where: { orderId: order.id, provider: 'STRIPE', status: { in: ['INITIATED', 'PENDING'] } },
        orderBy: { createdAt: 'desc' }
      });

      let intent;
      try {
        if (existing?.providerRef) {
          intent = await fastify.payments.stripe.paymentIntents.update(
            existing.providerRef,
            { amount, currency, metadata: { orderId: order.id } }
          );
        } else {
          intent = await fastify.payments.stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
            receipt_email: order.email || undefined,
            metadata: { orderId: order.id }
          });
        }
      } catch (err) {
        request.log.error({ err }, 'Stripe PaymentIntent failed');
        return reply.code(502).send({
          statusCode: 502,
          error: 'Bad Gateway',
          message: err.message || 'Stripe error'
        });
      }

      if (existing) {
        await fastify.prisma.payment.update({
          where: { id: existing.id },
          data: {
            providerRef: intent.id,
            amount: (intent.amount / (ZERO_DECIMAL.has((order.currency || 'USD').toUpperCase()) ? 1 : 100)).toFixed(2),
            rawPayload: { ...((existing.rawPayload) || {}), intent }
          }
        });
      } else {
        await fastify.prisma.payment.create({
          data: {
            orderId: order.id,
            provider: 'STRIPE',
            providerRef: intent.id,
            status: 'INITIATED',
            amount: Number(order.total).toFixed(2),
            currency: order.currency || 'USD',
            rawPayload: { intent }
          }
        });
      }

      return reply.send({
        paymentIntentId: intent.id,
        clientSecret: intent.client_secret,
        status: intent.status
      });
    }
  );

  // Webhook: raw body required for signature verification, no JWT, no rate limit.
  fastify.post(
    '/webhook',
    {
      config: { rateLimit: false, rawBody: true }
    },
    async (request, reply) => {
      if (!fastify.payments.stripe) {
        return reply.code(503).send({ message: 'Stripe not configured' });
      }

      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      const signature = request.headers['stripe-signature'];
      const isDev = process.env.NODE_ENV !== 'production';
      let event;

      if (secret) {
        try {
          event = fastify.payments.stripe.webhooks.constructEvent(
            request.rawBody,
            signature,
            secret
          );
        } catch (err) {
          request.log.warn({ err: err.message }, 'Stripe webhook signature invalid');
          return reply.code(400).send({ message: 'Invalid signature' });
        }
      } else if (isDev) {
        // No secret configured — dev-only escape hatch so local Stripe CLI
        // forwarding works without a real webhook secret. Never allowed
        // outside development (see H1 in the security review: this used to
        // silently trust unsigned payloads in any environment).
        request.log.warn(
          'STRIPE_WEBHOOK_SECRET is not set — accepting unsigned webhook (development only).'
        );
        event = request.body;
      } else {
        await logSecurityEvent(
          fastify,
          'STRIPE_WEBHOOK_SECRET_MISSING',
          'HIGH',
          {},
          request.ip
        );
        request.log.error(
          'STRIPE_WEBHOOK_SECRET is not set in production — refusing to process webhook.'
        );
        return reply.code(503).send({
          statusCode: 503,
          error: 'Service Unavailable',
          message: 'Webhook signing secret is not configured'
        });
      }

      const type = event.type;
      const obj = event.data?.object || {};
      const paymentIntentId = obj.id;

      if (
        type === 'payment_intent.succeeded' ||
        type === 'payment_intent.payment_failed' ||
        type === 'payment_intent.canceled' ||
        type === 'payment_intent.processing'
      ) {
        const payment = await fastify.prisma.payment.findFirst({
          where: { providerRef: paymentIntentId, provider: 'STRIPE' }
        });
        if (!payment) {
          request.log.warn({ paymentIntentId }, 'Stripe webhook for unknown payment');
          return reply.send({ received: true });
        }

        let nextPayment = payment.status;
        let nextOrder = null;
        if (type === 'payment_intent.succeeded') {
          nextPayment = 'SUCCESS';
          nextOrder = 'PAID';
        } else if (type === 'payment_intent.payment_failed') {
          nextPayment = 'FAILED';
          nextOrder = 'FAILED';
        } else if (type === 'payment_intent.canceled') {
          nextPayment = 'CANCELLED';
          nextOrder = 'CANCELLED';
        } else if (type === 'payment_intent.processing') {
          nextPayment = 'PENDING';
        }

        await fastify.prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: nextPayment,
              rawPayload: { ...((payment.rawPayload) || {}), [type]: event }
            }
          });
          if (nextOrder) {
            await tx.order.update({
              where: { id: payment.orderId },
              data: { status: nextOrder }
            });
          }
        });
        if (nextOrder === 'PAID') {
          notifyOrderPaid(fastify, payment.orderId).catch(() => {});
          finalizePaidOrder(fastify, payment.orderId).catch(() => {});
        }
      }

      return reply.send({ received: true });
    }
  );
}
