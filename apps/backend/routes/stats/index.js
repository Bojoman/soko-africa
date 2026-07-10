import { computePlatformStats } from '../../lib/platform-stats.js';

export default async function (fastify) {
  fastify.get('/platform', async () => {
    return computePlatformStats(fastify.prisma);
  });

  fastify.get('/testimonials', async () => {
    const reviews = await fastify.prisma.review.findMany({
      where: { rating: { gte: 4 } },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        user: { select: { firstName: true, lastName: true, country: true } },
        product: { select: { name: true, category: true } }
      }
    });

    const platform = await computePlatformStats(fastify.prisma);

    const testimonials = reviews.length
      ? reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          text: r.body,
          author: {
            name:
              [r.user?.firstName, r.user?.lastName].filter(Boolean).join(' ') ||
              'Customer',
            location: r.user?.country || 'Africa',
            role: r.product?.category
              ? `${r.product.category} buyer`
              : 'Verified buyer',
            avatar: null
          }
        }))
      : null;

    return {
      testimonials,
      stats: {
        happyCustomers: platform.happyCustomers,
        averageRating: platform.averageRating || 4.8,
        countriesServed: platform.countriesServed
      }
    };
  });
}
