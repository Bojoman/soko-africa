import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCompress from '@fastify/compress';

export default fp(async (fastify) => {
  // Enable gzip/brotli/deflate response compression for any payload >1KB.
  // Skip already-compressed binaries (images/video) handled elsewhere.
  await fastify.register(fastifyCompress, {
    global: true,
    threshold: 1024,
    encodings: ['br', 'gzip', 'deflate']
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const defaultRateLimitMax = isProduction
    ? parseInt(process.env.RATE_LIMIT_MAX || '60', 10)
    : 10000;

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : isProduction
      ? []
      : ['http://localhost:3000', 'http://localhost:3001'];

  if (isProduction && allowedOrigins.length === 0) {
    throw new Error(
      'ALLOWED_ORIGINS must be set in production (comma-separated frontend URLs).'
    );
  }

  fastify.register(fastifyCors, {
    origin: (origin, callback) => {
      // Allow server-to-server and same-origin navigations without an Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        fastify.log.warn({ origin }, 'CORS blocked request from unauthorized origin');
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
  });

  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: isProduction,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
  });

  fastify.register(fastifyRateLimit, {
    max: async (req, key) => {
      if (req.routeConfig?.rateLimit) {
        return isProduction ? req.routeConfig.rateLimit.max : Math.max(req.routeConfig.rateLimit.max, defaultRateLimitMax);
      }
      return defaultRateLimitMax;
    },
    timeWindow: async (req, key) => {
      if (req.routeConfig?.rateLimit) {
        return req.routeConfig.rateLimit.timeWindow;
      }
      return '1 minute';
    },
    keyGenerator: (req) => {
      return req.ip;
    },
    errorResponseBuilder: (req, context) => {
      fastify.log.warn({
        ip: req.ip,
        route: req.url,
        limit: context.max
      }, 'Rate limit exceeded');

      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${context.after}`,
        retryAfter: context.after
      };
    },
    onExceeded: async (req) => {
      try {
        await fastify.prisma.securityEvent.create({
          data: {
            type: 'RATE_LIMIT_EXCEEDED',
            severity: 'MEDIUM',
            details: {
              ip: req.ip,
              route: req.url,
              method: req.method,
              headers: {
                'user-agent': req.headers['user-agent'],
                referer: req.headers.referer
              }
            }
          }
        });
      } catch (err) {
        fastify.log.error({ err }, 'Failed to log rate limit exceeded event');
      }
    }
  });
});
