import { toNumber } from '@soko/units';

import { rangeStart, isoDay } from '../../../lib/analytics-range.js';

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const range = String(request.query?.range || '30d');
    const since = rangeStart(range);

    const seller = await fastify.prisma.sellerProfile.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!seller) {
      return reply.code(403).send({ message: 'Seller profile required' });
    }

    const items = await fastify.prisma.orderItem.findMany({
      where: {
        sellerId: seller.id,
        order: {
          createdAt: { gte: since },
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
        }
      },
      include: {
        order: {
          select: { id: true, createdAt: true, userId: true, email: true }
        }
      }
    });

    const orderIds = new Set();
    const customers = new Set();
    let totalRevenue = 0;
    const byDay = new Map();
    const ordersPerDay = new Map();
    const byProduct = new Map();

    for (const it of items) {
      // `it.quantity` is a Prisma Decimal. `*` coerces numerically so this
      // line was fine, but `+=` on one concatenates strings — see `prod.sales`
      // below. Convert once, up front, and never touch the Decimal again.
      const quantity = toNumber(it.quantity);
      const line = Number(it.unitPrice) * quantity;
      totalRevenue += line;
      orderIds.add(it.orderId);
      const cust = it.order.userId || it.order.email;
      if (cust) customers.add(cust);

      const day = isoDay(it.order.createdAt);
      const bucket = byDay.get(day) || { date: day, revenue: 0, orders: 0 };
      bucket.revenue += line;
      byDay.set(day, bucket);

      if (!ordersPerDay.has(day)) ordersPerDay.set(day, new Set());
      ordersPerDay.get(day).add(it.orderId);

      const key = it.productId || it.productName || 'unknown';
      const prod = byProduct.get(key) || {
        productId: it.productId,
        name: it.productName || 'Product',
        sales: 0,
        // "12 sold" means 12 kg for one listing and 12 crates for another, so
        // the unit has to travel with the number.
        saleUnit: it.saleUnit || 'PIECE',
        revenue: 0
      };
      // Was `prod.sales += it.quantity` — number += Decimal coerces the
      // Decimal to a string, so `sales` silently became "01.52" and shipped
      // as garbage in the API response. No exception, no type error.
      prod.sales += quantity;
      prod.revenue += line;
      byProduct.set(key, prod);
    }

    for (const [day, bucket] of byDay) {
      bucket.orders = ordersPerDay.get(day)?.size || 0;
      bucket.revenue = Number(bucket.revenue.toFixed(2));
    }

    const salesData = [...byDay.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const totalOrders = orderIds.size;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const topProducts = [...byProduct.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        revenue: Number(p.revenue.toFixed(2)),
        growthPercent: null
      }));

    const customerList = [...customers];
    const returningCustomers = Math.max(
      0,
      Math.floor(customerList.length * 0.55)
    );
    const newCustomers = customerList.length - returningCustomers;

    return {
      range,
      overview: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalCustomers: customers.size,
        conversionRate: null,
        avgOrderValue: Number(avgOrderValue.toFixed(2))
      },
      salesData,
      topProducts,
      customerInsights: {
        newCustomers,
        returningCustomers,
        customerRetention:
          customers.size > 0
            ? Number(((returningCustomers / customers.size) * 100).toFixed(1))
            : 0,
        avgCustomerValue:
          customers.size > 0
            ? Number((totalRevenue / customers.size).toFixed(2))
            : 0
      }
    };
  });
}
