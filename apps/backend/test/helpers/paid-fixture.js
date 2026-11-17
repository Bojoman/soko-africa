import { finalizePaidOrder } from '../../lib/finalize-paid-order.js';

// This helper is test code, never an HTTP route or a production escape hatch.
export async function settleTestOrder(orderId) {
  const url = process.env.TEST_DATABASE_URL;
  if (process.env.NODE_ENV !== 'test' || !url || url !== process.env.DATABASE_URL) {
    throw new Error('Paid fixtures require NODE_ENV=test and matching TEST_DATABASE_URL/DATABASE_URL');
  }
  const parsed = new URL(url);
  if (!['localhost', '127.0.0.1'].includes(parsed.hostname) || !parsed.pathname.endsWith('_test')) {
    throw new Error('Paid fixtures require a local database with a name ending in _test');
  }
  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import('../../prisma/generated/prisma/client.ts'),
    import('@prisma/adapter-pg')
  ]);
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    if (order.status !== 'PENDING_PAYMENT') throw new Error('Fixture must start unpaid');
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        payments: { create: {
          provider: 'TEST_FIXTURE', providerRef: orderId, status: 'SUCCESS',
          amount: order.total, currency: order.currency
        } }
      }
    });
    await finalizePaidOrder({ prisma, log: { error() {} } }, orderId);
  } finally {
    await prisma.$disconnect();
  }
}
