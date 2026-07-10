const listQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      seasonal: { type: 'string', maxLength: 5 }
    }
  }
};

const slugParamSchema = {
  params: {
    type: 'object',
    required: ['slug'],
    properties: { slug: { type: 'string', minLength: 1, maxLength: 200 } }
  }
};

function buildTree(flat) {
  const byId = new Map();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots = [];
  for (const c of byId.values()) {
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId).children.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

export default async function (fastify) {
  fastify.get('/', { schema: listQuerySchema }, async (request) => {
    const seasonalOnly =
      request.query?.seasonal === '1' || request.query?.seasonal === 'true';

    const cacheKey = `categories:list:${seasonalOnly ? 'seasonal' : 'tree'}`;
    const cached = fastify.cache.get(cacheKey);
    if (cached && !request.headers['x-no-cache']) {
      return cached;
    }

    if (seasonalOnly) {
      const flat = await fastify.prisma.category.findMany({
        where: { isSeasonal: true },
        orderBy: [{ position: 'asc' }, { name: 'asc' }]
      });
      const result = { categories: flat };
      fastify.cache.set(cacheKey, result, 300000);
      return result;
    }

    const flat = await fastify.prisma.category.findMany({
      orderBy: [{ position: 'asc' }, { name: 'asc' }]
    });

    const result = { categories: buildTree(flat) };
    fastify.cache.set(cacheKey, result, 300000);
    return result;
  });

  fastify.get('/:slug', { schema: slugParamSchema }, async (request, reply) => {
    const { slug } = request.params;

    const category = await fastify.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: { id: true, name: true, slug: true, parentId: true }
        },
        children: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            position: true,
            iconKey: true,
            isSeasonal: true
          }
        }
      }
    });

    if (!category) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Category not found'
      });
    }

    return { category };
  });
}
