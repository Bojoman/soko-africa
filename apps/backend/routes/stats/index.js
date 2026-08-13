import { computePlatformStats } from '../../lib/platform-stats.js';
import { SOKO_CURATED_TESTIMONIALS } from '../../lib/curated-testimonials.js';

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

    const live = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      text: r.body,
      author: {
        name:
          [r.user?.firstName, r.user?.lastName].filter(Boolean).join(' ') ||
          'Verified buyer',
        location: r.user?.country || 'Africa',
        role: r.product?.name
          ? `Bought ${r.product.name}`
          : r.product?.category
            ? `${r.product.category} buyer`
            : 'Verified buyer',
        avatar: null
      }
    }));

    // Prefer real reviews; pad with curated Soko stories so the homepage
    // carousel never feels empty on a young marketplace.
    const testimonials =
      live.length >= 3
        ? live
        : [...live, ...SOKO_CURATED_TESTIMONIALS].slice(0, 6);

    return {
      testimonials,
      stats: {
        happyCustomers: platform.happyCustomers || 0,
        averageRating: platform.averageRating || 4.9,
        countriesServed: Math.max(platform.countriesServed || 1, 1),
        reviewCount: platform.reviewCount || 0
      }
    };
  });
}
