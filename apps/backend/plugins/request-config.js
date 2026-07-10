import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    request.startTime = Date.now();
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    const duration = Date.now() - (request.startTime || Date.now());

    reply.header('X-Response-Time', `${duration}ms`);
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');

    if (process.env.NODE_ENV === 'production') {
      reply.header('X-Robots-Tag', 'noindex, nofollow');
    }
  });

  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
      fastify.log.error({
        err: error,
        request: {
          method: request.method,
          url: request.url,
          headers: {
            'user-agent': request.headers['user-agent'],
            'content-type': request.headers['content-type']
          }
        }
      }, 'Server error occurred');
    }

    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: error.validation.map(v => ({
          field: v.instancePath?.replace('/', '') || 'unknown',
          message: v.message
        }))
      });
    }

    if (error.code === 'FST_ERR_BAD_BODY') {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request body'
      });
    }

    if (error.code === 'FST_ERR_BAD_URL') {
      return reply.status(414).send({
        statusCode: 414,
        error: 'URI Too Long',
        message: 'Request URI too long'
      });
    }

    const response = {
      statusCode,
      error: error.name || 'Internal Server Error',
      message: statusCode >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message
    };

    reply.status(statusCode).send(response);
  });

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`
    });
  });
});
