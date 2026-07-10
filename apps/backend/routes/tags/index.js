const listQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string', maxLength: 200 },
      limit: { type: 'integer', minimum: 1, maximum: 200, default: 100 }
    }
  }
};

export default async function (fastify) {
  fastify.get('/', { schema: listQuerySchema }, async (request) => {
    const { search, limit = 100 } = request.query;
    const safeLimit = Math.min(parseInt(limit, 10) || 100, 200);

    const where = {};
    if (search) {
      const s = search.replace(/[%_]/g, '\\$&');
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { slug: { contains: s, mode: 'insensitive' } }
      ];
    }

    const tags = await fastify.prisma.tag.findMany({
      where,
      take: safeLimit,
      orderBy: { name: 'asc' }
    });

    return { tags };
  });
}
