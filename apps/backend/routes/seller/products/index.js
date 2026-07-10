/** Authenticated seller's own product catalog (all statuses). */

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const role = String(request.user.role || '').toUpperCase();

    const seller = await fastify.prisma.sellerProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!seller && role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Seller profile required' });
    }
    if (!seller) {
      return { products: [] };
    }

    const rows = await fastify.prisma.product.findMany({
      where: { sellerId: seller.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        currency: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        images: { take: 1, orderBy: { position: 'asc' }, select: { url: true } },
        variants: {
          where: { sku: 'DEFAULT' },
          take: 1,
          select: { id: true, stock: true }
        }
      }
    });

    const products = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      currency: p.currency,
      category: p.category,
      status: p.status,
      stock: p.variants[0]?.stock ?? 0,
      variantId: p.variants[0]?.id ?? null,
      image: p.images[0]?.url || null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    return { products };
  });
}
