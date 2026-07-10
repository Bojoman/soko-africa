/** Similar products (shared categories) for a product id. */

import { mapProductResponse, productPublicSelect } from '../../lib/map-product.js';

const productIdParam = {
  params: {
    type: 'object',
    required: ['productId'],
    properties: { productId: { type: 'string', maxLength: 100 } }
  }
};

export default async function (fastify) {
  fastify.get('/:productId', { schema: productIdParam }, async (request, reply) => {
    const { productId } = request.params;

    const product = await fastify.prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: 'PUBLISHED' },
      select: { id: true }
    });
    if (!product) {
      return reply.code(404).send({ message: 'Product not found', products: [] });
    }

    const links = await fastify.prisma.productCategory.findMany({
      where: { productId },
      select: { categoryId: true }
    });
    const categoryIds = links.map((l) => l.categoryId);
    if (!categoryIds.length) {
      return { products: [] };
    }

    const related = await fastify.prisma.product.findMany({
      where: {
        id: { not: productId },
        deletedAt: null,
        status: 'PUBLISHED',
        categories: { some: { categoryId: { in: categoryIds } } }
      },
      take: 12,
      orderBy: { createdAt: 'desc' },
      select: productPublicSelect()
    });

    return {
      products: related.map((p) => mapProductResponse(p))
    };
  });
}
