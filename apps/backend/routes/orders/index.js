import { createHash } from 'node:crypto';
import { quantityProperty, toNumber } from '@soko/units';
import { validateCheckout } from '../../lib/checkout-validation.js';
import { minorToDecimalString } from '../../lib/money.js';
import {
  assertOrderPaymentAccess, resolveAuthedUserId, guestTokenHash, GUEST_ACCESS_DAYS
} from '../../lib/order-access.js';

// Every checkout starts unpaid. Only verified payment handlers settle orders.
function orderUiStatus(status) {
  if (status === 'SHIPPED') return 'shipped';
  if (status === 'DELIVERED') return 'delivered';
  if (status === 'CANCELLED') return 'cancelled';
  return 'processing';
}

function serializeOrder(order) {
  const tracking =
    order.shipments?.find((s) => s.trackingNumber)?.trackingNumber || null;
  const addr = order.shippingAddress;
  const name =
    order.user &&
    [order.user.firstName, order.user.lastName].filter(Boolean).join(' ');
  return {
    id: order.id,
    status: order.status,
    uiStatus: orderUiStatus(order.status),
    createdAt: order.createdAt,
    total: Number(order.total),
    currency: order.currency,
    couponCode: order.couponCode,
    tracking,
    // A multi-seller order ships in several parcels, so the buyer needs each
    // seller's own tracking rather than just the first one found.
    shipments: (order.shipments || []).map((s) => ({
      id: s.id,
      status: s.status,
      method: s.method,
      carrier: s.carrier,
      trackingNumber: s.trackingNumber,
      sellerShop: s.seller?.shopName || null
    })),
    shippingAddress: addr
      ? {
          name: name || 'Customer',
          address: addr.line1,
          line2: addr.line2,
          city: addr.city,
          postalCode: addr.postalCode,
          country: addr.country,
          label: addr.label
        }
      : null,
    products: (order.items || []).map((it) => {
      const p = it.variant?.product;
      const img =
        it.productImage ||
        p?.images?.[0]?.url ||
        '/api/products/media/default-product.png';
      return {
        id: it.productId || p?.id,
        name: it.productName || p?.name || 'Item',
        // Prisma Decimal `toJSON` emits a string, which would silently change
        // this field from 1 to "1.5" and break arithmetic client-side.
        quantity: toNumber(it.quantity),
        price: Number(it.unitPrice),
        // Unit terms as they were AT PURCHASE TIME. A seller who later
        // switches this listing from PIECE to KILOGRAM must not rewrite an
        // old receipt, so this never reads from the live product.
        saleUnit: it.saleUnit || 'PIECE',
        quantityStep: toNumber(it.quantityStep, 1),
        netContentValue:
          it.netContentValue == null ? null : toNumber(it.netContentValue),
        netContentUnit: it.netContentUnit || null,
        // Per-line fulfillment, so a partially-shipped order reads honestly
        // instead of collapsing to one order-wide status.
        fulfillmentStatus: it.fulfillmentStatus,
        image: img,
        sellerShop: it.seller?.shopName
      };
    })
  };
}

const orderInclude = {
  user: { select: { firstName: true, lastName: true } },
  shippingAddress: true,
  shipments: { include: { seller: { select: { shopName: true } } } },
  items: {
    include: {
      seller: { select: { shopName: true } },
      variant: {
        include: {
          product: {
            include: { images: { take: 1, orderBy: { position: 'asc' } } }
          }
        }
      }
    }
  }
};

const orderIdParam = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', maxLength: 100 } }
  }
};

const checkoutItemSchema = {
  type: 'object',
  required: ['name', 'price', 'quantity'],
  properties: {
    id: { type: 'string', maxLength: 100 },
    productId: { type: 'string', maxLength: 100 },
    variantId: { type: 'string', maxLength: 100 },
    name: { type: 'string', minLength: 1, maxLength: 200 },
    price: { type: 'number', minimum: 0 },
    // In the product's own sale unit, so fractional for weight/volume goods.
    quantity: quantityProperty,
    image: { type: 'string', maxLength: 2000 },
    sellerId: { type: 'string', maxLength: 100 },
    currency: { type: 'string', maxLength: 10 }
  },
  additionalProperties: true
};

const createOrderSchema = {
  body: {
    type: 'object',
    properties: {
      addressId: { type: 'string', maxLength: 100 },
      couponCode: { type: 'string', maxLength: 50 },
      items: { type: 'array', maxItems: 100, items: checkoutItemSchema },
      contact: {
        type: 'object',
        properties: {
          email: { type: 'string', maxLength: 200 },
          phone: { type: 'string', maxLength: 50 }
        },
        additionalProperties: false
      },
      shippingAddress: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 200 },
          firstName: { type: 'string', maxLength: 100 },
          lastName: { type: 'string', maxLength: 100 },
          line1: { type: 'string', maxLength: 200 },
          line2: { type: 'string', maxLength: 200 },
          address: { type: 'string', maxLength: 200 },
          city: { type: 'string', maxLength: 100 },
          region: { type: 'string', maxLength: 100 },
          state: { type: 'string', maxLength: 100 },
          postalCode: { type: 'string', maxLength: 30 },
          country: { type: 'string', maxLength: 100 }
        },
        additionalProperties: false
      },
      totals: {
        type: 'object',
        properties: {
          subtotal: { type: 'number', minimum: 0 },
          shipping: { type: 'number', minimum: 0 },
          tax: { type: 'number', minimum: 0 },
          total: { type: 'number', minimum: 0 }
        },
        additionalProperties: false
      },
      currency: { type: 'string', maxLength: 10 },
      paymentMethod: { type: 'string', maxLength: 30 },
      shippingMethod: { type: 'string', maxLength: 20 }
    },
    additionalProperties: false
  }
};

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const orders = await fastify.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: orderInclude
    });
    return { orders: orders.map(serializeOrder) };
  });

  // Account and guest orders both require proof of ownership.
  fastify.get('/:id', { schema: orderIdParam }, async (request, reply) => {
    reply.header('Cache-Control', 'private, no-store');
    const { id } = request.params;
    const authedUserId = await resolveAuthedUserId(request);
    const order = await fastify.prisma.order.findUnique({
      where: { id },
      include: { ...orderInclude, payments: true }
    });
    if (!assertOrderPaymentAccess(order, authedUserId, reply, request)) return;

    const serialized = serializeOrder(order);
    const payments = (order.payments || []).map((p) => ({
      id: p.id,
      provider: p.provider,
      providerRef: p.providerRef,
      status: p.status,
      amount: Number(p.amount),
      currency: p.currency,
      createdAt: p.createdAt
    }));
    return {
      order: {
        ...serialized,
        email: order.email,
        phone: order.phone,
        subtotal: order.subtotal != null ? Number(order.subtotal) : null,
        shipping: order.shipping != null ? Number(order.shipping) : null,
        tax: order.tax != null ? Number(order.tax) : null,
        shippingAddressJson: order.shippingAddressJson,
        payments
      }
    };
  });

  fastify.post('/', { schema: createOrderSchema }, async (request, reply) => {
    const userId = await resolveAuthedUserId(request);
    const body = request.body || {};
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return reply.code(400).send({ message: 'Checkout requires items and payment confirmation' });
    }
    const guestHash = userId ? null : guestTokenHash(request);
    if (!userId && !guestHash) {
      return reply.code(401).send({ message: 'Start a guest checkout session before placing an order' });
    }

    // Scope retry keys to the account or private guest credential. A leaked
    // idempotency key must never grant access to another customer's receipt.
    const rawKey = request.headers['idempotency-key'];
    if (rawKey != null && (typeof rawKey !== 'string' || rawKey.length < 8 || rawKey.length > 128)) {
      return reply.code(400).send({ message: 'Idempotency-Key must contain 8 to 128 characters' });
    }
    const idempotencyKey = rawKey
      ? createHash('sha256').update(JSON.stringify([userId || guestHash, rawKey])).digest('hex')
      : null;

    const respond = (order, status, extra = {}) => reply.code(status).send({
      orderId: order.id,
      status: order.status,
      totals: {
        subtotal: Number(order.subtotal || 0),
        discount: Math.max(0, Number((Number(order.subtotal || 0) + Number(order.shipping || 0) + Number(order.tax || 0) - Number(order.total)).toFixed(2))),
        shipping: Number(order.shipping || 0),
        tax: Number(order.tax || 0),
        total: Number(order.total)
      },
      currency: order.currency,
      ...extra
    });
    const replay = async () => {
      const existing = idempotencyKey
        ? await fastify.prisma.order.findUnique({ where: { idempotencyKey } })
        : null;
      if (!existing) return false;
      if (assertOrderPaymentAccess(existing, userId, reply, request)) {
        respond(existing, 200, { idempotent: true });
      }
      return true;
    };

    if (await replay()) return reply;
    let priced;
    try {
      priced = await validateCheckout(fastify.prisma, body);
    } catch (err) {
      if (err.statusCode !== 400) throw err;
      return reply.code(400).send({ message: err.message });
    }

    try {
      const order = await fastify.prisma.order.create({
        data: {
          userId,
          guestAccessTokenHash: guestHash,
          guestAccessExpiresAt: guestHash
            ? new Date(Date.now() + GUEST_ACCESS_DAYS * 86400000)
            : null,
          email: body.contact?.email || null,
          phone: body.contact?.phone || null,
          status: 'PENDING_PAYMENT',
          subtotal: priced.subtotal.toFixed(2),
          shipping: priced.shipping.toFixed(2),
          tax: priced.tax.toFixed(2),
          total: priced.total.toFixed(2),
          currency: priced.currency,
          couponCode: priced.couponCode,
          shippingAddressJson: body.shippingAddress || null,
          idempotencyKey,
          items: {
            create: priced.lines.map(line => ({
              productId: line.productId,
              variantId: line.variantId,
              sellerId: line.sellerId,
              productName: line.name,
              productImage: line.image,
              quantity: line.quantity,
              saleUnit: line.saleUnit,
              quantityStep: line.quantityStep,
              netContentValue: line.netContentValue,
              netContentUnit: line.netContentUnit,
              unitPrice: line.unitPrice.toFixed(2),
              subtotal: minorToDecimalString(line.subtotalMinor, line.currency)
            }))
          }
        }
      });
      if (priced.couponCode && priced.discount > 0) {
        await fastify.prisma.coupon.updateMany({
          where: { code: priced.couponCode },
          data: { redemptions: { increment: 1 } }
        });
      }
      return respond(order, 201);
    } catch (err) {
      if (err?.code === 'P2002' && await replay()) return reply;
      throw err;
    }
  });
}
