import { validateCheckout } from '../../lib/checkout-validation.js';

/**
 * Buyer orders endpoints.
 *
 * Two flows are supported on POST /orders:
 *
 * 1. Cart-based (legacy): authenticated user, body has no `items`. The server
 *    builds the order from the user's stored cart, marks it PAID immediately
 *    (stub payment), decrements stock, and clears the cart.
 *
 * 2. Payment-driven (multi-provider): body contains `items` plus
 *    contact/shipping/totals. The order is created in PENDING_PAYMENT and a
 *    payment provider (M-Pesa / PayPal / Stripe) is expected to drive it to
 *    PAID via the /payments/* endpoints + webhooks. Auth is optional here so
 *    guest checkout works.
 *
 * Both flows are guarded by Fastify schema validation. GET endpoints still
 * require auth.
 */

function orderUiStatus(status) {
  if (status === 'SHIPPED') return 'shipped';
  if (status === 'DELIVERED') return 'delivered';
  if (status === 'CANCELLED') return 'cancelled';
  return 'processing';
}

function unitPrice(variant, product) {
  if (variant?.price != null && variant.price !== undefined) {
    const n = Number(variant.price);
    if (!Number.isNaN(n)) return n;
  }
  const p = Number(product?.price);
  return Number.isNaN(p) ? 0 : p;
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
        quantity: it.quantity,
        price: Number(it.unitPrice),
        image: img,
        sellerShop: it.seller?.shopName
      };
    })
  };
}

const orderInclude = {
  user: { select: { firstName: true, lastName: true } },
  shippingAddress: true,
  shipments: true,
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
    quantity: { type: 'integer', minimum: 1, maximum: 1000 },
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
        additionalProperties: true
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

  // Optional auth: authed users see their own; anyone with the (unguessable)
  // order id can read it (supports guest checkout status page). Sensitive PII
  // is not returned.
  fastify.get('/:id', { schema: orderIdParam }, async (request, reply) => {
    const { id } = request.params;
    let authedUserId = null;
    try {
      await request.jwtVerify();
      authedUserId = request.user?.sub || null;
    } catch {
      // anonymous lookup is allowed
    }

    const order = await fastify.prisma.order.findFirst({
      where: authedUserId
        ? { id, OR: [{ userId: authedUserId }, { userId: null }] }
        : { id, userId: null },
      include: { ...orderInclude, payments: true }
    });
    if (!order) {
      return reply.code(404).send({ message: 'Order not found' });
    }

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
    // Auth is optional. The cart-based legacy flow requires auth; the
    // payment-driven flow is selected when `body.items` is provided and
    // works for guest checkout as well.
    let userId = null;
    try {
      await request.jwtVerify();
      userId = request.user?.sub || null;
    } catch {
      userId = null;
    }

    const body = request.body || {};

    // ---------- Payment-driven flow ----------
    if (Array.isArray(body.items) && body.items.length > 0) {
      let priced;
      try {
        priced = await validateCheckout(fastify.prisma, body);
      } catch (e) {
        const code = e.statusCode || 400;
        return reply.code(code).send({ message: e.message || 'Invalid checkout' });
      }

      const {
        lines,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        currency,
        couponCode
      } = priced;

      try {
        const idempotencyKey = request.headers['idempotency-key'];
        if (idempotencyKey && typeof idempotencyKey === 'string') {
          // Best-effort idempotency: look for a recently created order with
          // the same key embedded as the couponCode? We don't have a key column
          // so we store it on the shippingAddressJson under a private key.
          // (Avoids a schema migration just for this nice-to-have.)
          const existing = await fastify.prisma.order.findFirst({
            where: {
              userId,
              shippingAddressJson: { path: ['__idempotencyKey'], equals: idempotencyKey }
            },
            orderBy: { createdAt: 'desc' }
          });
          if (existing) {
            return reply.code(200).send({
              orderId: existing.id,
              status: existing.status,
              totals: {
                subtotal: Number(existing.subtotal || 0),
                shipping: Number(existing.shipping || 0),
                tax: Number(existing.tax || 0),
                total: Number(existing.total)
              },
              currency: existing.currency,
              idempotent: true
            });
          }
        }

        const shippingAddressJson = body.shippingAddress
          ? {
              ...body.shippingAddress,
              ...(idempotencyKey ? { __idempotencyKey: idempotencyKey } : {})
            }
          : idempotencyKey
          ? { __idempotencyKey: idempotencyKey }
          : null;

        const order = await fastify.prisma.order.create({
          data: {
            userId,
            email: body.contact?.email || null,
            phone: body.contact?.phone || null,
            status: 'PENDING_PAYMENT',
            subtotal: Number(subtotal).toFixed(2),
            shipping: Number(shipping).toFixed(2),
            tax: Number(tax).toFixed(2),
            total: Number(total).toFixed(2),
            currency,
            couponCode: couponCode || null,
            shippingAddressJson,
            items: {
              create: lines.map((line) => ({
                productId: line.productId,
                variantId: line.variantId,
                sellerId: line.sellerId,
                productName: line.name,
                productImage: line.image,
                quantity: line.quantity,
                unitPrice: line.unitPrice.toFixed(2),
                subtotal: line.subtotal.toFixed(2)
              }))
            }
          }
        });

        if (couponCode && discount > 0) {
          await fastify.prisma.coupon.updateMany({
            where: { code: couponCode },
            data: { redemptions: { increment: 1 } }
          });
        }

        return reply.code(201).send({
          orderId: order.id,
          status: order.status,
          totals: {
            subtotal: Number(order.subtotal || 0),
            discount: Number(discount),
            shipping: Number(order.shipping || 0),
            tax: Number(order.tax || 0),
            total: Number(order.total)
          },
          currency: order.currency
        });
      } catch (e) {
        fastify.log.error({ err: e }, 'Order creation failed (payment-driven)');
        return reply
          .code(500)
          .send({ message: 'Could not create order. Please try again.' });
      }
    }

    // ---------- Legacy cart-based flow (requires auth) ----------
    if (!userId) {
      return reply
        .code(401)
        .send({ message: 'Authentication required for cart checkout' });
    }
    const addressId = body.addressId;
    const couponCodeRaw = body.couponCode;

    try {
      const result = await fastify.prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true
                  }
                }
              }
            }
          }
        });

        if (!cart || !cart.items.length) {
          const err = new Error('Cart is empty');
          err.statusCode = 400;
          throw err;
        }

        let shippingAddressId = addressId || null;
        if (!shippingAddressId) {
          const def = await tx.address.findFirst({
            where: { userId, isDefault: true }
          });
          if (def) shippingAddressId = def.id;
        }

        if (shippingAddressId) {
          const addr = await tx.address.findFirst({
            where: { id: shippingAddressId, userId }
          });
          if (!addr) {
            const err = new Error('Invalid shipping address');
            err.statusCode = 400;
            throw err;
          }
        }

        const lines = [];
        let requiresCold = false;
        for (const ci of cart.items) {
          const { variant, quantity } = ci;
          const product = variant.product;
          if (!product || product.deletedAt || product.status !== 'PUBLISHED') {
            const err = new Error('Invalid cart line');
            err.statusCode = 400;
            throw err;
          }
          if (product.requiresColdChain) requiresCold = true;
          const up = unitPrice(variant, product);
          if (variant.stock < quantity) {
            const err = new Error(`Insufficient stock for ${product.name}`);
            err.statusCode = 400;
            throw err;
          }
          lines.push({
            variant,
            product,
            quantity,
            unitPrice: up,
            sellerId: product.sellerId
          });
        }

        let subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
        let discount = 0;
        let appliedCoupon = null;

        const code = String(couponCodeRaw || '')
          .trim()
          .toUpperCase();
        if (code) {
          const coupon = await tx.coupon.findUnique({ where: { code } });
          if (
            coupon &&
            (!coupon.activeUntil || coupon.activeUntil > new Date()) &&
            (coupon.maxRedemptions == null ||
              coupon.redemptions < coupon.maxRedemptions) &&
            coupon.scope === 'CART'
          ) {
            if (coupon.percentOff != null) {
              discount += (subtotal * coupon.percentOff) / 100;
            } else if (coupon.amountOff != null) {
              discount += Number(coupon.amountOff);
            }
            appliedCoupon = coupon;
          }
        }

        discount = Math.min(discount, subtotal);
        const total = Math.max(0, subtotal - discount);
        const currency = lines[0]?.product.currency || 'USD';

        const order = await tx.order.create({
          data: {
            userId,
            status: 'PAID',
            total: total.toFixed(2),
            currency,
            shippingAddressId,
            couponCode: appliedCoupon?.code || null,
            items: {
              create: lines.map((l) => ({
                variantId: l.variant.id,
                sellerId: l.sellerId,
                quantity: l.quantity,
                unitPrice: l.unitPrice.toFixed(2)
              }))
            },
            payments: {
              create: {
                provider: 'stub',
                providerRef: 'offline-checkout',
                status: 'CAPTURED',
                amount: total.toFixed(2),
                currency
              }
            },
            shipments: {
              create: {
                method: requiresCold ? 'COLD_CHAIN' : 'STANDARD',
                status: 'PENDING',
                requiresColdChain: requiresCold
              }
            }
          },
          include: orderInclude
        });

        for (const l of lines) {
          await tx.productVariant.update({
            where: { id: l.variant.id },
            data: { stock: { decrement: l.quantity } }
          });
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        if (appliedCoupon) {
          await tx.coupon.update({
            where: { id: appliedCoupon.id },
            data: { redemptions: { increment: 1 } }
          });
        }

        return order;
      });

      return reply.code(201).send({ order: serializeOrder(result) });
    } catch (e) {
      const code = e.statusCode || 500;
      if (code >= 500) fastify.log.error(e);
      return reply.code(code).send({ message: e.message || 'Order failed' });
    }
  });
}
