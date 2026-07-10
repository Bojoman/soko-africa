import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    fastify.log.info('Sentry disabled (SENTRY_DSN not set)');
    return;
  }

  const Sentry = await import('@sentry/node');
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
  });

  fastify.addHook('onError', async (request, reply, error) => {
    Sentry.captureException(error, {
      extra: { url: request.url, method: request.method }
    });
  });

  fastify.log.info('Sentry initialized');
});
