import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_BODY_SIZE = parseInt(process.env.MAX_BODY_SIZE ?? '', 10) || 1048576;
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT ?? '', 10) || 30000;
const CONNECTION_TIMEOUT = parseInt(process.env.CONNECTION_TIMEOUT ?? '', 10) || 5000;

export default async function (fastify, opts) {
  fastify.register(import('@fastify/sensible'));

  fastify.addHook('onReady', async () => {
    fastify.log.info('Server configuration:');
    fastify.log.info(`- Max body size: ${MAX_BODY_SIZE} bytes`);
    fastify.log.info(`- Request timeout: ${REQUEST_TIMEOUT}ms`);
    fastify.log.info(`- Connection timeout: ${CONNECTION_TIMEOUT}ms`);
    fastify.log.info(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  fastify.register(autoload, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  fastify.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts),
    routeParams: {
      bodyLimit: MAX_BODY_SIZE,
      timeout: REQUEST_TIMEOUT
    }
  });
}

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined
    },
    bodyLimit: MAX_BODY_SIZE,
    connectionTimeout: CONNECTION_TIMEOUT,
    keepAliveTimeout: 65000,
    requestTimeout: REQUEST_TIMEOUT,
    caseSensitive: false,
    ignoreTrailingSlash: true,
    maxParamLength: 100,
    trustProxy: process.env.TRUST_PROXY === 'true',
    genReqId: () => `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  });

  return app;
}
