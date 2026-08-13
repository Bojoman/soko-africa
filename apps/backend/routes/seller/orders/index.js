/** Orders containing line items fulfilled by the authenticated seller — JWT required. */

import { toNumber } from '@soko/units';

import {
  SELLER_SETTABLE_STATUSES,
  deriveOrderStatus,
  deriveShipmentStatus,
  isFulfillable,
  nextStatuses,
  transitionError
} from '../../../lib/fulfillment.js';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const updateItemSchema = {
  params: {
    type: 'object',
    required: ['orderId', 'itemId'],
    properties: {
      orderId: { type: 'string', maxLength: 100 },
      itemId: { type: 'string', maxLength: 100 }
    }
  },
  body: {
    type: 'object',
    required: ['fulfillmentStatus'],
    properties: {
      fulfillmentStatus: { type: 'string', enum: SELLER_SETTABLE_STATUSES }
    },
    additionalProperties: false
  }
};

const shipmentSchema = {
  params: {
    type: 'object',
    required: ['orderId'],
    properties: { orderId: { type: 'string', maxLength: 100 } }
  },
  body: {
    type: 'object',
    properties: {
      carrier: { type: 'string', maxLength: 120 },
      trackingNumber: { type: 'string', maxLength: 120 },
      method: { type: 'string', enum: ['STANDARD', 'EXPRESS', 'COLD_CHAIN'] }
    },
    additionalProperties: false
  }
};

/**
 * The buyer's delivery address, from the Address relation or the checkout
 * snapshot. A seller could previously see only a name and email, which is not
 * enough to physically ship anything.
 *
 * `shippingAddressJson` doubles as a metadata bag (stockDecremented,
 * confirmationEmailSent), so only address keys are picked out of it.
 */
function shippingAddressFor(order) {
  const addr = order.shippingAddress;
  if (addr) {
    return {
      name: addr.label || null,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state ?? null,
      postalCode: addr.postalCode,
      country: addr.country
    };
  }

  const snap = order.shippingAddressJson;
  if (!snap || typeof snap !== 'object') return null;

  const pick = (...keys) => {
    for (const k of keys) {
      if (typeof snap[k] === 'string' && snap[k].trim()) return snap[k];
    }
    return null;
  };

  const line1 = pick('line1', 'address', 'address1', 'street');
  const city = pick('city');
  if (!line1 && !city) return null;

  return {
    name: pick('name', 'fullName'),
    line1,
    line2: pick('line2', 'address2', 'apartment'),
    city,
    state: pick('state', 'region', 'county'),
    postalCode: pick('postalCode', 'postcode', 'zip'),
    country: pick('country')
  };
}

function summarizeForSeller(order, sellerId) {
  const myItems = (order.items || []).filter((i) => i.sellerId === sellerId);
  const subtotal = myItems.reduce(
    (s, i) => s + Number(i.unitPrice) * toNumber(i.quantity),
    0
  );

  // This seller's own shipment. Legacy rows have no sellerId; fall back to an
  // order-level one so pre-existing tracking numbers still surface.
  const shipment =
    order.shipments?.find((sh) => sh.sellerId === sellerId) ||
    order.shipments?.find((sh) => sh.sellerId == null) ||
    null;

  const buyerName =
    order.user &&
    [order.user.firstName, order.user.lastName].filter(Boolean).join(' ');

  // An abandoned checkout still lists here; offering "start preparing" on it
  // would invite a seller to ship goods nobody paid for.
  const fulfillable = isFulfillable(order.status);

  return {
    id: order.id,
    status: order.status,
    fulfillable,
    createdAt: order.createdAt,
    currency: order.currency,
    buyerEmail: order.user?.email || order.email || null,
    buyerName: buyerName || null,
    buyerPhone: order.phone || null,
    shippingAddress: shippingAddressFor(order),
    shipment: shipment
      ? {
          id: shipment.id,
          status: shipment.status,
          method: shipment.method,
          carrier: shipment.carrier,
          trackingNumber: shipment.trackingNumber,
          requiresColdChain: shipment.requiresColdChain
        }
      : null,
    tracking: shipment?.trackingNumber || null,
    sellerSubtotal: subtotal,
    lineItems: myItems.map((it) => {
      const p = it.variant?.product;
      const img = it.productImage || p?.images?.[0]?.url || null;
      return {
        id: it.id,
        quantity: toNumber(it.quantity),
        saleUnit: it.saleUnit || 'PIECE',
        quantityStep: toNumber(it.quantityStep, 1),
        netContentValue:
          it.netContentValue == null ? null : toNumber(it.netContentValue),
        netContentUnit: it.netContentUnit || null,
        unitPrice: Number(it.unitPrice),
        fulfillmentStatus: it.fulfillmentStatus,
        // Drives which action buttons the seller UI offers.
        nextStatuses: fulfillable ? nextStatuses(it.fulfillmentStatus) : [],
        product: p
          ? { id: p.id, name: p.name, slug: p.slug, image: img }
          : { id: it.productId, name: it.productName || 'Product', slug: null, image: img }
      };
    })
  };
}

const orderListInclude = {
  user: { select: { firstName: true, lastName: true, email: true } },
  shippingAddress: true,
  shipments: true,
  items: {
    include: {
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

/** Resolve the caller's seller profile, or send the right error. */
async function requireSeller(fastify, request, reply) {
  const seller = await fastify.prisma.sellerProfile.findUnique({
    where: { userId: request.user.sub },
    select: { id: true, shopName: true }
  });
  if (!seller) {
    reply.code(403).send({ message: 'Seller profile required' });
    return null;
  }
  return seller;
}

/**
 * Recompute the seller's shipment status and the order's overall status from
 * the current line items. Runs inside the caller's transaction.
 */
async function syncDerivedStatuses(tx, orderId, sellerId) {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: { sellerId: true, fulfillmentStatus: true }
  });

  const mine = items.filter((i) => i.sellerId === sellerId).map((i) => i.fulfillmentStatus);
  const shipment = await tx.shipment.findFirst({ where: { orderId, sellerId } });
  if (shipment) {
    await tx.shipment.update({
      where: { id: shipment.id },
      data: { status: deriveShipmentStatus(mine) }
    });
  }

  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: { status: true }
  });
  const nextStatus = deriveOrderStatus(
    order.status,
    items.map((i) => i.fulfillmentStatus)
  );
  if (nextStatus !== order.status) {
    await tx.order.update({ where: { id: orderId }, data: { status: nextStatus } });
  }
  return nextStatus;
}

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const role = String(request.user.role || '').toUpperCase();

    const seller = await fastify.prisma.sellerProfile.findUnique({
      where: { userId }
    });

    if (!seller && role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Seller profile required' });
    }

    if (!seller) {
      return { orders: [] };
    }

    const sellerId = seller.id;

    const distinct = await fastify.prisma.orderItem.findMany({
      where: { sellerId },
      distinct: ['orderId'],
      select: { orderId: true }
    });

    const orderIds = distinct.map((d) => d.orderId);
    if (!orderIds.length) {
      return { orders: [] };
    }

    const orders = await fastify.prisma.order.findMany({
      where: { id: { in: orderIds } },
      orderBy: { createdAt: 'desc' },
      include: orderListInclude
    });

    return {
      orders: orders.map((o) => summarizeForSeller(o, sellerId))
    };
  });

  /** Advance one of the seller's own line items through the fulfillment flow. */
  fastify.patch(
    '/:orderId/items/:itemId',
    { onRequest: [fastify.authenticate], schema: updateItemSchema },
    async (request, reply) => {
      const { orderId, itemId } = request.params;
      if (!UUID_RE.test(orderId) || !UUID_RE.test(itemId)) {
        return reply.code(400).send({ message: 'Invalid order or item id' });
      }

      const seller = await requireSeller(fastify, request, reply);
      if (!seller) return undefined;

      const item = await fastify.prisma.orderItem.findFirst({
        where: { id: itemId, orderId },
        select: {
          id: true,
          sellerId: true,
          fulfillmentStatus: true,
          order: { select: { status: true } }
        }
      });

      // Same 404 whether the line is missing or belongs to another shop, so
      // this cannot be used to probe other sellers' orders.
      if (!item || item.sellerId !== seller.id) {
        return reply.code(404).send({ message: 'Order item not found' });
      }

      // The client hides the buttons, but the endpoint is the real boundary.
      if (!isFulfillable(item.order.status)) {
        return reply.code(409).send({
          message: `This order is ${String(item.order.status)
            .toLowerCase()
            .replace(/_/g, ' ')} — it cannot be fulfilled yet`
        });
      }

      const target = request.body.fulfillmentStatus;
      const invalid = transitionError(item.fulfillmentStatus, target);
      if (invalid) {
        return reply.code(409).send({ message: invalid });
      }

      const updated = await fastify.prisma.$transaction(async (tx) => {
        await tx.orderItem.update({
          where: { id: item.id },
          data: { fulfillmentStatus: target }
        });
        const orderStatus = await syncDerivedStatuses(tx, orderId, seller.id);
        return { orderStatus };
      });

      await fastify.prisma.auditLog.create({
        data: {
          action: 'ORDER_ITEM_FULFILLMENT_CHANGED',
          actorId: request.user.sub,
          target: item.id,
          context: { orderId, from: item.fulfillmentStatus, to: target },
          ipAddress: request.ip,
          userAgent: request.headers['user-agent']
        }
      });

      return {
        ok: true,
        itemId: item.id,
        fulfillmentStatus: target,
        nextStatuses: nextStatuses(target),
        orderStatus: updated.orderStatus
      };
    }
  );

  /** Record carrier / tracking for this seller's portion of an order. */
  fastify.post(
    '/:orderId/shipment',
    { onRequest: [fastify.authenticate], schema: shipmentSchema },
    async (request, reply) => {
      const { orderId } = request.params;
      if (!UUID_RE.test(orderId)) {
        return reply.code(400).send({ message: 'Invalid order id' });
      }

      const seller = await requireSeller(fastify, request, reply);
      if (!seller) return undefined;

      const items = await fastify.prisma.orderItem.findMany({
        where: { orderId, sellerId: seller.id },
        select: { fulfillmentStatus: true, variant: { select: { product: { select: { requiresColdChain: true } } } } }
      });
      if (!items.length) {
        return reply.code(404).send({ message: 'Order not found' });
      }

      const parent = await fastify.prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true }
      });
      if (!isFulfillable(parent?.status)) {
        return reply.code(409).send({
          message: 'This order cannot be shipped until it is paid'
        });
      }

      const body = request.body || {};
      const requiresColdChain = items.some(
        (i) => i.variant?.product?.requiresColdChain
      );
      const method =
        body.method || (requiresColdChain ? 'COLD_CHAIN' : 'STANDARD');

      const shipment = await fastify.prisma.$transaction(async (tx) => {
        const existing = await tx.shipment.findFirst({
          where: { orderId, sellerId: seller.id }
        });

        const data = {
          method,
          requiresColdChain,
          status: deriveShipmentStatus(items.map((i) => i.fulfillmentStatus)),
          ...(body.carrier !== undefined ? { carrier: body.carrier || null } : {}),
          ...(body.trackingNumber !== undefined
            ? { trackingNumber: body.trackingNumber || null }
            : {})
        };

        return existing
          ? tx.shipment.update({ where: { id: existing.id }, data })
          : tx.shipment.create({ data: { orderId, sellerId: seller.id, ...data } });
      });

      return {
        ok: true,
        shipment: {
          id: shipment.id,
          status: shipment.status,
          method: shipment.method,
          carrier: shipment.carrier,
          trackingNumber: shipment.trackingNumber,
          requiresColdChain: shipment.requiresColdChain
        }
      };
    }
  );
}
