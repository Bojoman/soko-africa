import { computePlatformStats } from '../../lib/platform-stats.js';
import { relativeTime } from '../../lib/analytics-range.js';

function requireAdmin(request, reply) {
  if (String(request.user.role || '').toUpperCase() !== 'ADMIN') {
    reply.code(403).send({ message: 'Admin access required' });
    return false;
  }
  return true;
}

export default async function (fastify) {
  fastify.get('/cache/stats', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    return fastify.cache.getStats();
  });

  fastify.post('/cache/clear', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    fastify.cache.clear();
    return { message: 'Cache cleared' };
  });

  fastify.get('/dashboard', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;

    const platform = await computePlatformStats(fastify.prisma);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [revenueAgg, newUsers, newSellers, newProducts, pendingSellers, draftProducts, auditLogs, failedPayments] =
      await Promise.all([
        fastify.prisma.payment.aggregate({
          where: { status: { in: ['SUCCESS', 'CAPTURED'] } },
          _sum: { amount: true }
        }),
        fastify.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        fastify.prisma.sellerProfile.count({
          where: { createdAt: { gte: thirtyDaysAgo }, verificationStatus: 'APPROVED' }
        }),
        fastify.prisma.product.count({
          where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null }
        }),
        fastify.prisma.sellerProfile.findMany({
          where: { verificationStatus: 'PENDING' },
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { email: true, firstName: true, lastName: true } } }
        }),
        fastify.prisma.product.findMany({
          where: { status: 'DRAFT', deletedAt: null },
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { seller: { select: { shopName: true } } }
        }),
        fastify.prisma.auditLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { actor: { select: { firstName: true, lastName: true, email: true } } }
        }),
        fastify.prisma.payment.findMany({
          where: { status: 'FAILED' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { order: { select: { id: true } } }
        })
      ]);

    const pendingApprovals = [
      ...pendingSellers.map((s) => ({
        id: s.id,
        type: 'seller_application',
        name: s.shopName,
        email: s.user?.email,
        sellerName: null,
        submittedAt: s.createdAt
      })),
      ...draftProducts.map((p) => ({
        id: p.id,
        type: 'product_listing',
        name: p.name,
        email: null,
        sellerName: p.seller?.shopName,
        submittedAt: p.createdAt
      }))
    ];

    const recentActivity = [
      ...auditLogs.map((log) => ({
        id: log.id,
        type: log.action.toLowerCase(),
        message: `${log.action}${log.actor ? `: ${[log.actor.firstName, log.actor.lastName].filter(Boolean).join(' ')}` : ''}`,
        createdAt: log.createdAt,
        status: 'info'
      })),
      ...failedPayments.map((p) => ({
        id: p.id,
        type: 'payment_issue',
        message: `Payment failed for order ${p.orderId?.slice(0, 8) || 'unknown'}`,
        createdAt: p.createdAt,
        status: 'error'
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const mailConfigured = Boolean(process.env.SMTP_HOST || process.env.SMTP_URL);

    return {
      stats: {
        totalUsers: { value: platform.happyCustomers, changeLabel: `+${newUsers} this month` },
        activeSellers: { value: platform.artisans, changeLabel: `+${newSellers} new sellers` },
        totalProducts: { value: platform.totalProducts, changeLabel: `+${newProducts} this month` },
        platformRevenue: {
          value: Number(revenueAgg._sum.amount || 0),
          currency: 'USD',
          changeLabel: 'all time captured'
        }
      },
      pendingApprovals,
      recentActivity: recentActivity.map((a) => ({
        ...a,
        time: relativeTime(a.createdAt)
      })),
      systemStatus: {
        api: 'online',
        database: 'healthy',
        paymentGateway: process.env.STRIPE_SECRET_KEY ? 'connected' : 'warning',
        emailService: mailConfigured ? 'connected' : 'warning'
      }
    };
  });

  fastify.post('/sellers/:id/approve', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { id } = request.params;
    const seller = await fastify.prisma.sellerProfile.update({
      where: { id },
      data: { verificationStatus: 'APPROVED', verifiedAt: new Date() }
    });
    return { seller };
  });

  fastify.post('/sellers/:id/reject', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { id } = request.params;
    const seller = await fastify.prisma.sellerProfile.update({
      where: { id },
      data: { verificationStatus: 'REJECTED' }
    });
    return { seller };
  });

  fastify.post('/products/:id/publish', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { id } = request.params;
    const product = await fastify.prisma.product.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });
    fastify.cache.clear();
    return { product };
  });
}
