import fp from 'fastify-plugin';
import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function connectWithRetry(prisma, fastify, retries = 0) {
  try {
    await prisma.$connect();
    fastify.log.info('Prisma connected to the database');
    return true;
  } catch (err) {
    if (retries < MAX_RETRIES) {
      fastify.log.warn(
        { err: err.message, retries: retries + 1, maxRetries: MAX_RETRIES },
        `Database connection failed. Retrying in ${RETRY_DELAY}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(prisma, fastify, retries + 1);
    } else {
      fastify.log.error(
        { err: err.message },
        'Max database connection retries exceeded. Server will run, but DB-backed routes will fail.'
      );
      return false;
    }
  }
}

export default fp(async (fastify) => {
  const databaseUrl = process.env.DATABASE_URL;
  const poolSize = parseInt(process.env.DB_POOL_SIZE, 10) || 10;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Prisma 7+ requires a driver adapter. We use @prisma/adapter-pg
  // which wraps node-postgres to provide the connection.
  const adapter = new PrismaPg({
    connectionString: databaseUrl,
    max: poolSize
  });

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'info' },
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' }
        ]
      : [
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' }
        ]
  });

  // Log slow queries (>1s). Never include raw params in logs — they may
  // contain bcrypt hashes, refresh tokens, emails, etc.
  prisma.$on('query', (e) => {
    if (e.duration > 1000) {
      fastify.log.warn({
        query: e.query,
        duration: e.duration,
        target: 'slow_query'
      }, 'Slow query detected');
    }
  });

  await connectWithRetry(prisma, fastify);

  fastify.decorate('prisma', prisma);

  // Keep-alive query every 30 seconds. unref() so it doesn't keep the
  // event loop alive on shutdown.
  const keepAliveTimer = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      fastify.log.error({ err }, 'Database health check failed');
    }
  }, 30000);
  if (typeof keepAliveTimer.unref === 'function') {
    keepAliveTimer.unref();
  }

  fastify.addHook('onClose', async (fastify) => {
    fastify.log.info('Disconnecting Prisma client...');
    clearInterval(keepAliveTimer);
    await fastify.prisma.$disconnect();
  });

  const gracefulShutdown = async (signal) => {
    fastify.log.info(`Received ${signal}. Starting graceful shutdown...`);

    fastify.server.close(async () => {
      fastify.log.info('HTTP server closed. Disconnecting database...');
      await prisma.$disconnect();
      fastify.log.info('Database disconnected. Exiting...');
      process.exit(0);
    });

    setTimeout(() => {
      fastify.log.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
});
