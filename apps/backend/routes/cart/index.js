/** Cart API — requires JWT; uses default ProductVariant per product (sku DEFAULT). */

import {
  checkQuantity,
  formatQuantity,
  hasSufficientStock,
  normalizeQuantity,
  quantityProperty,
  toNumber,
  unitSpec
} from '@soko/units';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const addItemSchema = {
  body: {
    type: 'object',
    required: ['productId'],
    properties: {
      productId: { type: 'string', minLength: 1, maxLength: 100 },
      // Was `integer, max 99`. Quantities are now expressed in the product's
      // own sale unit, so 1.5 means 1.5 kg.
      quantity: quantityProperty
    },
    additionalProperties: false
  }
};

const syncSchema = {
  body: {
    type: 'object',
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        maxItems: 50,
        items: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: { type: 'string', minLength: 1, maxLength: 100 },
            quantity: quantityProperty
          },
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  }
};

const updateItemSchema = {
  body: {
    type: 'object',
    required: ['quantity'],
    properties: {
      quantity: quantityProperty
    },
    additionalProperties: false
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', maxLength: 100 } }
  }
};

const idOnlyParams = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', maxLength: 100 } }
  }
};

const productSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  currency: true,
  category: true,
  // The cart's steppers enforce the same step / minimum / stock rules as the
  // product page, so the unit terms have to travel with each line.
  saleUnit: true,
  quantityStep: true,
  minOrderQuantity: true,
  maxOrderQuantity: true,
  netContentValue: true,
  netContentUnit: true,
  images: { take: 1, orderBy: { position: 'asc' } },
  seller: { select: { shopName: true } }
};

const cartInclude = {
  items: {
    include: {
      variant: {
        select: {
          id: true,
          sku: true,
          price: true,
          stockQuantity: true,
          product: { select: productSelect }
        }
      }
    }
  }
};

/**
 * Prisma Decimals stringify via `toJSON`, so a raw cart would ship
 * `quantity: "1.500"` and every client-side `quantity + 1` would concatenate
 * instead of add. Convert at the boundary.
 */
function serializeCart(cart) {
  if (!cart) return cart;
  return {
    ...cart,
    items: (cart.items || []).map((item) => {
      const product = item.variant?.product;
      const spec = product ? unitSpec(product) : null;
      return {
        ...item,
        quantity: toNumber(item.quantity),
        variant: item.variant
          ? {
              ...item.variant,
              price: item.variant.price == null ? null : toNumber(item.variant.price),
              stockQuantity: toNumber(item.variant.stockQuantity),
              product: product
                ? {
                    ...product,
                    price: toNumber(product.price),
                    saleUnit: spec.saleUnit,
                    quantityStep: spec.quantityStep,
                    minOrderQuantity: spec.minOrderQuantity,
                    maxOrderQuantity: spec.maxOrderQuantity,
                    netContentValue: spec.netContentValue,
                    netContentUnit: spec.netContentUnit
                  }
                : product
            }
          : item.variant
      };
    })
  };
}

async function resolveVariant(prisma, productId) {
  let variant = await prisma.productVariant.findFirst({
    where: { productId, sku: 'DEFAULT' }
  });

  if (!variant) {
    variant = await prisma.productVariant.findFirst({
      where: { productId },
      orderBy: { createdAt: 'asc' }
    });
  }

  return variant;
}

async function getOrCreateCart(prisma, userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: cartInclude
    });
  }

  return cart;
}

async function addItemToCart(prisma, cartId, productId, quantity) {
  const product = await prisma.product.findFirst({
    where: { id: productId, deletedAt: null, status: 'PUBLISHED' }
  });

  if (!product) {
    return { error: 'not_found', status: 404, message: 'Product not found' };
  }

  const variant = await resolveVariant(prisma, product.id);

  if (!variant) {
    return { error: 'no_variant', status: 400, message: 'Product has no purchasable variant' };
  }

  const spec = unitSpec({ ...product, stockQuantity: variant.stockQuantity });

  // "Add to cart" with no quantity means one minimum order — which for a
  // per-kilogram listing with a 1 kg minimum is 1 kg, not 1 of nothing.
  const requested = quantity == null ? spec.minOrderQuantity : toNumber(quantity);

  const invalid = checkQuantity(spec, requested, product.name);
  if (invalid) {
    return { error: 'quantity', status: 400, message: invalid.message };
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId, variantId: variant.id } }
  });

  // `existing.quantity` is a Prisma Decimal. `Decimal + number` coerces via
  // valueOf() to a STRING, so the old `(existing?.quantity || 0) + quantity`
  // silently produced "1.51.5" rather than 3. Convert first.
  const combined = toNumber(existing?.quantity, 0) + requested;

  // The sum of two legal quantities is not always itself legal (with a
  // minimum of 1 and a step of 2, 1 + 1 = 2 misses the step), so snap the
  // accumulated total. This is snapping an accumulation, not overriding an
  // explicit request — `checkQuantity` above still rejects a bad payload.
  const newQty = normalizeQuantity(spec, combined);

  if (!hasSufficientStock(variant.stockQuantity, newQty)) {
    return {
      error: 'stock',
      status: 400,
      message: `Only ${formatQuantity(variant.stockQuantity, spec, {
        force: true
      })} available in stock`
    };
  }

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId, variantId: variant.id, quantity: newQty }
    });
  }

  return { ok: true };
}

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {
    const cart = await getOrCreateCart(fastify.prisma, request.user.sub);

    return { cart: serializeCart(cart) };
  });

  fastify.post(
    '/sync',
    { onRequest: [fastify.authenticate], schema: syncSchema },
    async (request, reply) => {
      const userId = request.user.sub;
      const items = request.body?.items || [];

      if (!items.length) return { ok: true, merged: 0 };

      let cart = await fastify.prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        cart = await fastify.prisma.cart.create({ data: { userId } });
      }

      let merged = 0;

      for (const row of items) {
        const productId = String(row.productId || '').trim();

        if (!UUID_RE.test(productId)) continue;

        // Merging a guest cart is best-effort: `addItemToCart` snaps each
        // quantity to the product's rules rather than rejecting the whole
        // sync, so a stale localStorage cart still merges cleanly.
        const qty = toNumber(row.quantity, 0) || undefined;
        const result = await addItemToCart(fastify.prisma, cart.id, productId, qty);

        if (result.ok) merged += 1;
      }

      const full = await getOrCreateCart(fastify.prisma, userId);

      return reply.send({ ok: true, merged, cart: serializeCart(full) });
    }
  );

  fastify.post(
    '/items',
    { onRequest: [fastify.authenticate], schema: addItemSchema },
    async (request, reply) => {
      const userId = request.user.sub;
      const productId = String(request.body?.productId || '').trim();
      const quantity = request.body?.quantity;

      if (!UUID_RE.test(productId)) {
        return reply.code(400).send({ message: 'Invalid productId' });
      }

      let cart = await fastify.prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        cart = await fastify.prisma.cart.create({ data: { userId } });
      }

      const result = await addItemToCart(fastify.prisma, cart.id, productId, quantity);

      if (result.error) {
        return reply.code(result.status).send({ message: result.message });
      }

      const full = await getOrCreateCart(fastify.prisma, userId);

      return reply.code(201).send({ ok: true, cart: serializeCart(full) });
    }
  );

  fastify.patch(
    '/items/:id',
    { onRequest: [fastify.authenticate], schema: updateItemSchema },
    async (request, reply) => {
      const userId = request.user.sub;
      const { id } = request.params;

      if (!UUID_RE.test(String(id))) {
        return reply.code(400).send({ message: 'Invalid item id' });
      }

      const cart = await fastify.prisma.cart.findUnique({ where: { userId } });

      if (!cart) return reply.code(404).send({ message: 'Cart not found' });

      const item = await fastify.prisma.cartItem.findFirst({
        where: { id, cartId: cart.id },
        include: { variant: { include: { product: true } } }
      });

      if (!item) return reply.code(404).send({ message: 'Item not found' });

      const product = item.variant?.product;
      const spec = unitSpec({
        ...(product || {}),
        stockQuantity: item.variant?.stockQuantity
      });
      const quantity = toNumber(request.body?.quantity, 0);

      const invalid = checkQuantity(spec, quantity, product?.name || 'this item');
      if (invalid) {
        return reply.code(400).send({ message: invalid.message });
      }

      if (!hasSufficientStock(item.variant.stockQuantity, quantity)) {
        return reply.code(400).send({
          message: `Only ${formatQuantity(item.variant.stockQuantity, spec, {
            force: true
          })} available in stock`
        });
      }

      await fastify.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity }
      });

      const full = await getOrCreateCart(fastify.prisma, userId);

      return { ok: true, cart: serializeCart(full) };
    }
  );

  fastify.delete(
    '/items/:id',
    { onRequest: [fastify.authenticate], schema: idOnlyParams },
    async (request, reply) => {
      const userId = request.user.sub;
      const { id } = request.params;

      if (!UUID_RE.test(String(id))) {
        return reply.code(400).send({ message: 'Invalid item id' });
      }

      const cart = await fastify.prisma.cart.findUnique({ where: { userId } });

      if (!cart) return reply.code(404).send({ message: 'Cart not found' });

      const item = await fastify.prisma.cartItem.findFirst({
        where: { id, cartId: cart.id }
      });

      if (!item) return reply.code(404).send({ message: 'Item not found' });

      await fastify.prisma.cartItem.delete({ where: { id: item.id } });

      const full = await getOrCreateCart(fastify.prisma, userId);

      return { ok: true, cart: serializeCart(full) };
    }
  );
}
