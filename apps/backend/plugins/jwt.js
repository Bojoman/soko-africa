import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { randomUUID } from 'crypto';

export default fp(async (fastify) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    fastify.log.error('JWT_SECRET environment variable is required');
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (jwtSecret.length < 32) {
    fastify.log.error('JWT_SECRET must be at least 32 characters long');
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const weakSecrets = new Set([
    'your-super-secret-jwt-key-minimum-32-chars-long-change-in-production',
    'changeme',
    'secret',
    'jwt-secret',
    'development-secret-key-change-me'
  ]);
  if (isProduction && weakSecrets.has(jwtSecret)) {
    throw new Error(
      'JWT_SECRET is a known placeholder. Generate a unique secret before deploying to production.'
    );
  }

  const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

  // Tokens carry their own `exp` (set per-token by `expiresIn`), so no global
  // `maxAge` here — that would cap refresh tokens at the *access* token
  // lifetime and log everyone out 15 minutes after signing in.
  //
  // No `cookie` option either: sessions reach the API as `Authorization:
  // Bearer`, minted by the Next BFF from its httpOnly cookie. Configuring
  // cookie lookup without @fastify/cookie makes every anonymous request throw
  // FST_JWT_BAD_COOKIE_REQUEST instead of a plain "missing token" 401.
  await fastify.register(fastifyJwt, {
    secret: jwtSecret,
    decode: { complete: true },
    sign: {
      expiresIn: accessTokenExpiry,
      algorithm: 'HS256'
    },
    verify: {
      algorithms: ['HS256']
    }
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();

      // The `role` claim is a snapshot from whenever the token was signed, so a
      // customer who upgrades to seller keeps failing role-gated routes until
      // their access token expires. Authorize against the live role instead.
      const account = await fastify.prisma.user.findUnique({
        where: { id: request.user.sub },
        select: { role: true, isActive: true }
      });

      if (!account || account.isActive === false) {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Account is no longer active'
        });
      }

      request.user.role = account.role;
    } catch (err) {
      // Handle specific JWT errors from @fastify/jwt v10
      const errorCode = err.code || err.message;

      // Expiry is checked first: it also carries statusCode 401, so testing the
      // generic case ahead of it would swallow the TOKEN_EXPIRED signal.
      if (errorCode === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED' ||
          err.message?.includes('expired')) {
        reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (errorCode === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE' ||
                 errorCode === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' ||
                 errorCode === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' ||
                 err.statusCode === 401) {
        reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or missing authentication token'
        });
      } else {
        fastify.log.warn({ err }, 'JWT verification failed');
        reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Authentication failed'
        });
      }
    }
  });

  fastify.decorate('signAccessToken', (payload) => {
    return fastify.jwt.sign({
      ...payload,
      type: 'access'
    });
  });

  fastify.decorate('signRefreshToken', async (userId) => {
    // `jti` keeps each token unique. Without it, two refresh tokens minted for
    // the same user within the same second are byte-identical (same payload,
    // same second-resolution iat/exp) and collide on RefreshToken.token.
    const token = fastify.jwt.sign(
      { sub: userId, type: 'refresh', jti: randomUUID() },
      { expiresIn: refreshTokenExpiry }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await fastify.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });

    return token;
  });

  fastify.decorate('verifyRefreshToken', async (token) => {
    try {
      const decoded = fastify.jwt.verify(token);

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const storedToken = await fastify.prisma.refreshToken.findUnique({
        where: { token },
        select: {
          token: true,
          revokedAt: true,
          expiresAt: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              firstName: true,
              lastName: true,
              isActive: true
            }
          }
        }
      });

      if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
        throw new Error('Token revoked or expired');
      }

      if (storedToken.user?.isActive === false) {
        throw new Error('Account disabled');
      }

      return { valid: true, userId: decoded.sub, user: storedToken.user };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  });

  fastify.decorate('revokeRefreshToken', async (token) => {
    await fastify.prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() }
    });
  });

  fastify.decorate('revokeAllUserRefreshTokens', async (userId) => {
    await fastify.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  });
});
