import os from 'os';

export default async function (fastify) {
  fastify.get('/', async (request, reply) => {
    const checks = {
      database: { status: 'unknown', responseTime: 0 },
      memory: { status: 'unknown', usage: 0, heapUsed: '', heapTotal: '', rss: '' },
      uptime: process.uptime()
    };

    let overallStatus = 'ok';
    let statusCode = 200;

    try {
      const dbStart = Date.now();
      await fastify.prisma.$queryRaw`SELECT 1 as health_check`;
      checks.database = {
        status: 'up',
        responseTime: Date.now() - dbStart
      };
    } catch (err) {
      checks.database = {
        status: 'down',
        responseTime: 0,
        error: process.env.NODE_ENV === 'production' ? 'Database unavailable' : err.message
      };
      overallStatus = 'degraded';
      statusCode = 503;
    }

    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);
    const memoryUsage = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

    checks.memory = {
      status: memoryUsage > 90 ? 'warning' : 'ok',
      heapUsed: `${heapUsedMB}MB`,
      heapTotal: `${heapTotalMB}MB`,
      rss: `${rssMB}MB`,
      usage: memoryUsage
    };

    if (memoryUsage > 90 && overallStatus === 'ok') {
      overallStatus = 'warning';
    }

    const cacheStats = fastify.cache?.getStats();

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        loadAvg: os.loadavg()
      },
      cache: cacheStats || null
    };

    return reply.code(statusCode).send(response);
  });

  fastify.get('/ready', async (request, reply) => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return { ready: true };
    } catch (err) {
      return reply.code(503).send({ ready: false, error: 'Database not ready' });
    }
  });

  fastify.get('/live', async () => {
    return { alive: true, timestamp: new Date().toISOString() };
  });
}
