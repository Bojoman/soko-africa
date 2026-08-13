/** Authenticated seller's own product catalog (all statuses). */

import { toNumber, unitSpec } from '@soko/units';

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
        description: true,
        requiresColdChain: true,
        saleUnit: true,
        quantityStep: true,
        minOrderQuantity: true,
        maxOrderQuantity: true,
        netContentValue: true,
        netContentUnit: true,
        images: {
          orderBy: { position: 'asc' },
          select: { url: true, alt: true, position: true }
        },
        variants: {
          where: { sku: 'DEFAULT' },
          take: 1,
          select: { id: true, stockQuantity: true }
        }
      }
    });

    const products = rows.map((p) => {
      // Decimals must not reach the seller's edit form — they would arrive as
      // strings and round-trip back into the API as strings.
      const spec = unitSpec(p);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        currency: p.currency,
        category: p.category,
        status: p.status,
        requiresColdChain: p.requiresColdChain ?? false,
        saleUnit: spec.saleUnit,
        quantityStep: spec.quantityStep,
        minOrderQuantity: spec.minOrderQuantity,
        maxOrderQuantity: spec.maxOrderQuantity,
        netContentValue: spec.netContentValue,
        netContentUnit: spec.netContentUnit,
        stock: toNumber(p.variants[0]?.stockQuantity, 0),
        variantId: p.variants[0]?.id ?? null,
        images: p.images,
        image: p.images[0]?.url || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    });

    return { products };
  });
}
