export async function computePlatformStats(prisma) {
  const [
    userCount,
    sellerCount,
    productCount,
    categoryCount,
    reviewAgg,
    paidOrders,
    countries
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.sellerProfile.count({ where: { verificationStatus: 'APPROVED' } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.category.count(),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
    prisma.order.count({
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
    }),
    prisma.address.findMany({ select: { country: true }, distinct: ['country'] })
  ]);

  const avgRating = reviewAgg._avg.rating ? Number(reviewAgg._avg.rating) : 0;
  const satisfaction =
    reviewAgg._count > 0 ? Math.round((avgRating / 5) * 100) : null;

  return {
    happyCustomers: Math.max(userCount, paidOrders),
    artisans: sellerCount,
    countriesServed: Math.max(countries.length, 1),
    customerSatisfactionPercent: satisfaction,
    averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
    reviewCount: reviewAgg._count,
    productCategories: categoryCount,
    africanCountries: 54,
    totalProducts: productCount
  };
}
