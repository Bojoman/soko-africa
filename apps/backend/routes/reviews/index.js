/** Product reviews — GET public; POST requires JWT. */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const productIdParam = {
  params: {
    type: 'object',
    required: ['productId'],
    properties: { productId: { type: 'string', maxLength: 100 } }
  }
};

function productWhere(productId) {
  return UUID_RE.test(productId)
    ? { id: productId, deletedAt: null, status: 'PUBLISHED' }
    : { slug: productId, deletedAt: null, status: 'PUBLISHED' };
}

const createReviewSchema = {
  body: {
    type: 'object',
    required: ['rating', 'body'],
    properties: {
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      title: { type: 'string', maxLength: 200 },
      body: { type: 'string', minLength: 1, maxLength: 5000 },
      orderItemId: { type: 'string', maxLength: 100 }
    },
    additionalProperties: false
  },
  params: productIdParam.params
};

export default async function (fastify) {
  fastify.get('/:productId', { schema: productIdParam }, async (request, reply) => {
    const { productId } = request.params;

    const product = await fastify.prisma.product.findFirst({
      where: productWhere(productId)
    });
    if (!product) {
      return reply.code(404).send({ message: 'Product not found' });
    }

    const reviews = await fastify.prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { firstName: true, lastName: true } } }
    });

    return {
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        author:
          [r.user?.firstName, r.user?.lastName].filter(Boolean).join(' ') ||
          'Customer',
        verifiedPurchase: Boolean(r.orderItemId)
      }))
    };
  });

  fastify.post(
    '/:productId',
    {
      onRequest: [fastify.authenticate],
      schema: createReviewSchema,
      config: { rateLimit: { max: 20, timeWindow: '1 hour' } }
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { productId } = request.params;
      const { rating, title, body, orderItemId } = request.body || {};

      const r = parseInt(rating, 10);
      if (Number.isNaN(r) || r < 1 || r > 5) {
        return reply.code(400).send({ message: 'rating must be 1–5' });
      }
      if (!body || typeof body !== 'string' || !body.trim()) {
        return reply.code(400).send({ message: 'body is required' });
      }

      const product = await fastify.prisma.product.findFirst({
        where: productWhere(productId)
      });
      if (!product) {
        return reply.code(404).send({ message: 'Product not found' });
      }

      let verifiedOrderItemId = null;
      if (orderItemId) {
        const oi = await fastify.prisma.orderItem.findFirst({
          where: {
            id: orderItemId,
            order: { userId },
            variant: { productId: product.id }
          }
        });
        if (!oi) {
          return reply
            .code(400)
            .send({ message: 'Invalid orderItemId for this product' });
        }
        verifiedOrderItemId = oi.id;
      }

      const created = await fastify.prisma.review.create({
        data: {
          productId: product.id,
          userId,
          rating: r,
          title: title && String(title).trim() ? String(title).trim() : null,
          body: body.trim(),
          orderItemId: verifiedOrderItemId
        },
        include: { user: { select: { firstName: true, lastName: true } } }
      });

      return reply.code(201).send({
        review: {
          id: created.id,
          rating: created.rating,
          title: created.title,
          body: created.body,
          createdAt: created.createdAt,
          author:
            [created.user?.firstName, created.user?.lastName]
              .filter(Boolean)
              .join(' ') || 'Customer',
          verifiedPurchase: Boolean(created.orderItemId)
        }
      });
    }
  );
}
