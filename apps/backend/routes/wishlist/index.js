/** Wishlist — JWT required. */

const productIdParamSchema = {
  params: {
    type: 'object',
    required: ['productId'],
    properties: { productId: { type: 'string', maxLength: 100 } }
  }
};

function mapWishlistItem(row) {
  const p = row.product;
  const img = p?.images?.[0]?.url || null;
  return {
    id: row.id,
    productId: row.productId,
    createdAt: row.createdAt,
    product: p
      ? {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price != null ? Number(p.price) : null,
          currency: p.currency,
          status: p.status,
          images: p.images || [],
          image: img,
          seller: p.seller
            ? {
                shopName: p.seller.shopName,
                slug: p.seller.slug
              }
            : null
        }
      : null
  };
}

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const items = await fastify.prisma.wishlistItem.findMany({
      where: {
        userId,
        product: { deletedAt: null, status: 'PUBLISHED' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            seller: { select: { shopName: true, slug: true } }
          }
        }
      }
    });
    const mapped = items.map(mapWishlistItem);
    return { items: mapped };
  });

  fastify.post('/:productId', {
    onRequest: [fastify.authenticate],
    schema: productIdParamSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const { productId } = request.params;

    const product = await fastify.prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: 'PUBLISHED' }
    });
    if (!product) {
      return reply.code(404).send({ message: 'Product not found' });
    }

    await fastify.prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId }
      },
      create: { userId, productId },
      update: {}
    });

    return reply.code(201).send({ ok: true });
  });

  fastify.delete('/:productId', {
    onRequest: [fastify.authenticate],
    schema: productIdParamSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const { productId } = request.params;

    await fastify.prisma.wishlistItem.deleteMany({
      where: { userId, productId }
    });

    return { ok: true };
  });
}
