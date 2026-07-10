/** Cart API — requires JWT; uses default ProductVariant per product (sku DEFAULT). */



const UUID_RE =

  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;



const addItemSchema = {

  body: {

    type: 'object',

    required: ['productId'],

    properties: {

      productId: { type: 'string', minLength: 1, maxLength: 100 },

      quantity: { type: 'integer', minimum: 1, maximum: 99 }

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

            quantity: { type: 'integer', minimum: 1, maximum: 99 }

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

      quantity: { type: 'integer', minimum: 1, maximum: 99 }

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

  images: { take: 1, orderBy: { position: 'asc' } },

  seller: { select: { shopName: true } }

};



const cartInclude = {

  items: {

    include: {

      variant: {

        include: {

          product: { select: productSelect }

        }

      }

    }

  }

};



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



  const existing = await prisma.cartItem.findUnique({

    where: { cartId_variantId: { cartId, variantId: variant.id } }

  });



  const newQty = (existing?.quantity || 0) + quantity;

  if (newQty > variant.stock) {

    return {

      error: 'stock',

      status: 400,

      message: `Only ${variant.stock} available in stock`

    };

  }



  if (existing) {

    await prisma.cartItem.update({

      where: { id: existing.id },

      data: { quantity: newQty }

    });

  } else {

    await prisma.cartItem.create({

      data: { cartId, variantId: variant.id, quantity }

    });

  }



  return { ok: true };

}



export default async function (fastify) {

  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {

    const cart = await getOrCreateCart(fastify.prisma, request.user.sub);

    return { cart };

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

        const qty = Math.max(1, Math.min(99, parseInt(row.quantity, 10) || 1));

        const result = await addItemToCart(fastify.prisma, cart.id, productId, qty);

        if (result.ok) merged += 1;

      }



      const full = await getOrCreateCart(fastify.prisma, userId);

      return reply.send({ ok: true, merged, cart: full });

    }

  );



  fastify.post(

    '/items',

    { onRequest: [fastify.authenticate], schema: addItemSchema },

    async (request, reply) => {

      const userId = request.user.sub;

      const productId = String(request.body?.productId || '').trim();

      const quantity = Math.max(1, Math.min(99, parseInt(request.body?.quantity, 10) || 1));



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

      return reply.code(201).send({ ok: true, cart: full });

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

      const quantity = Math.max(1, Math.min(99, parseInt(request.body?.quantity, 10) || 1));



      const cart = await fastify.prisma.cart.findUnique({ where: { userId } });

      if (!cart) return reply.code(404).send({ message: 'Cart not found' });



      const item = await fastify.prisma.cartItem.findFirst({

        where: { id, cartId: cart.id },

        include: { variant: true }

      });

      if (!item) return reply.code(404).send({ message: 'Item not found' });



      if (quantity > item.variant.stock) {

        return reply

          .code(400)

          .send({ message: `Only ${item.variant.stock} available in stock` });

      }



      await fastify.prisma.cartItem.update({

        where: { id: item.id },

        data: { quantity }

      });

      const full = await getOrCreateCart(fastify.prisma, userId);

      return { ok: true, cart: full };

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

      return { ok: true, cart: full };

    }

  );

}


