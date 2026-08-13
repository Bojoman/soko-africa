import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { logSecurityEvent } from '../../lib/security-events.js';

const SALT_ROUNDS = 12;

const authUserSelect = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  sellerProfile: {
    select: {
      id: true,
      shopName: true,
      slug: true,
      verificationStatus: true
    }
  }
};

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        maxLength: 255
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        pattern:
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$'
      },
      firstName: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      lastName: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      role: {
        type: 'string',
        enum: ['customer', 'seller']
      }
    },
    additionalProperties: false
  }
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: 255 },
      password: { type: 'string', maxLength: 128 }
    },
    additionalProperties: false
  }
};

const refreshTokenSchema = {
  body: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
  }
};

const forgotPasswordSchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: 255 }
    },
    additionalProperties: false
  }
};

const resetPasswordSchema = {
  body: {
    type: 'object',
    required: ['token', 'password'],
    properties: {
      token: { type: 'string', minLength: 32, maxLength: 128 },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        pattern:
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$'
      }
    },
    additionalProperties: false
  }
};

const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

// Failed-login lockout is a sliding window over the SecurityEvent audit
// table (Postgres) rather than an in-process Map. The previous in-memory
// implementation reset on every restart/deploy and wasn't shared across
// horizontally scaled instances, so an attacker could defeat it just by
// waiting for a restart or spreading requests across instances (see H3 in
// the security review). Every LOGIN_FAILED event already gets written to
// SecurityEvent for audit purposes — this reuses that same data as the
// lockout counter instead of tracking it a second time.
async function checkFailedAttempts(fastify, email) {
  const since = new Date(Date.now() - LOCKOUT_DURATION_MS);
  const recentFailures = await fastify.prisma.securityEvent.findMany({
    where: {
      type: 'LOGIN_FAILED',
      createdAt: { gte: since },
      details: { path: ['email'], equals: email }
    },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true }
  });

  if (recentFailures.length >= MAX_ATTEMPTS) {
    const firstAttempt = recentFailures[0].createdAt.getTime();
    const remainingMs = LOCKOUT_DURATION_MS - (Date.now() - firstAttempt);
    if (remainingMs > 0) {
      return {
        locked: true,
        message: `Account locked. Try again in ${Math.ceil(remainingMs / 60000)} minutes`
      };
    }
  }

  return { locked: false };
}

export default async function (fastify) {
  fastify.post('/register', {
    schema: registerSchema,
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } }
  }, async (request, reply) => {
    const { password, firstName, lastName } = request.body;
    const email = String(request.body.email || '').trim().toLowerCase();
    // Seller role is granted only after POST /sellers creates a shop profile.
    // The register form's "seller" option only controls the post-signup redirect.
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    if (existingUser) {
      await logSecurityEvent(fastify, 'REGISTRATION_ATTEMPT_DUPLICATE', 'MEDIUM', { email });
      return reply.code(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'User already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await fastify.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'CUSTOMER'
      },
      select: authUserSelect
    });

    const accessToken = fastify.signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = await fastify.signRefreshToken(user.id);

    await logSecurityEvent(fastify, 'USER_REGISTERED', 'LOW', { userId: user.id, email });

    // Fire-and-forget: signup must not block on the mail provider's latency.
    fastify.mail
      .sendWelcome(user)
      .catch((err) => fastify.log.error({ err, userId: user.id }, 'Welcome email failed'));

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    };
  });

  fastify.post('/login', {
    schema: loginSchema,
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }
  }, async (request, reply) => {
    const { password } = request.body;
    const email = String(request.body.email || '').trim().toLowerCase();

    const lockoutCheck = await checkFailedAttempts(fastify, email);
    if (lockoutCheck.locked) {
      await logSecurityEvent(fastify, 'LOGIN_BLOCKED', 'HIGH', { email, reason: 'too_many_attempts' });
      return reply.code(423).send({
        statusCode: 423,
        error: 'Locked',
        message: lockoutCheck.message
      });
    }

    const user = await fastify.prisma.user.findUnique({
      where: { email },
      select: {
        ...authUserSelect,
        passwordHash: true,
        isActive: true
      }
    });
    if (!user) {
      await logSecurityEvent(fastify, 'LOGIN_FAILED', 'MEDIUM', { email, reason: 'unknown_email' });
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      await logSecurityEvent(fastify, 'LOGIN_FAILED', 'MEDIUM', { email, userId: user.id, reason: 'invalid_password' });
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    if (user.isActive === false) {
      await logSecurityEvent(fastify, 'LOGIN_FAILED', 'MEDIUM', { email, userId: user.id, reason: 'account_disabled' });
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Account is disabled'
      });
    }

    // No explicit "clear" step: the lockout is a sliding window over an
    // append-only audit log (see checkFailedAttempts above), so a successful
    // login doesn't retroactively erase prior failures — they just age out
    // of the 15-minute window naturally. Deleting SecurityEvent rows here
    // would undermine their purpose as an audit trail.
    const accessToken = fastify.signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = await fastify.signRefreshToken(user.id);

    await logSecurityEvent(fastify, 'LOGIN_SUCCESS', 'LOW', { userId: user.id, email });

    const { passwordHash: _pw, isActive: _active, ...safeUser } = user;

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    };
  });

  fastify.post('/refresh', {
    schema: refreshTokenSchema,
    config: { rateLimit: { max: 20, timeWindow: '15 minutes' } }
  }, async (request, reply) => {
    const { refreshToken } = request.body;

    const result = await fastify.verifyRefreshToken(refreshToken);

    if (!result.valid) {
      await logSecurityEvent(fastify, 'REFRESH_TOKEN_INVALID', 'HIGH', { reason: result.error });
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    await fastify.revokeRefreshToken(refreshToken);

    const newAccessToken = fastify.signAccessToken({ sub: result.userId, role: result.user.role });
    const newRefreshToken = await fastify.signRefreshToken(result.userId);

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900
      }
    };
  });

  fastify.post('/logout', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { refreshToken } = request.body || {};

    if (refreshToken) {
      await fastify.revokeRefreshToken(refreshToken);
    }

    await fastify.revokeAllUserRefreshTokens(request.user.sub);

    await logSecurityEvent(fastify, 'LOGOUT', 'LOW', { userId: request.user.sub });

    return { message: 'Logged out successfully' };
  });

  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: request.user.sub },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        bio: true,
        createdAt: true,
        sellerProfile: {
          select: {
            id: true,
            shopName: true,
            slug: true,
            verificationStatus: true
          }
        }
      }
    });

    if (!user) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found'
      });
    }

    return user;
  });

  const updateMeSchema = {
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 100 },
        lastName: { type: 'string', minLength: 1, maxLength: 100 },
        phone: { type: 'string', maxLength: 30 },
        country: { type: 'string', maxLength: 100 },
        bio: { type: 'string', maxLength: 500 }
      },
      additionalProperties: false
    }
  };

  fastify.patch('/me', {
    onRequest: [fastify.authenticate],
    schema: updateMeSchema
  }, async (request, reply) => {
    const body = request.body || {};
    const data = {};
    if (body.firstName !== undefined) data.firstName = String(body.firstName).trim();
    if (body.lastName !== undefined) data.lastName = String(body.lastName).trim();
    if (body.phone !== undefined) data.phone = String(body.phone).trim() || null;
    if (body.country !== undefined) data.country = String(body.country).trim() || null;
    if (body.bio !== undefined) data.bio = String(body.bio).trim() || null;

    const user = await fastify.prisma.user.update({
      where: { id: request.user.sub },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        bio: true,
        createdAt: true,
        sellerProfile: {
          select: {
            id: true,
            shopName: true,
            slug: true,
            verificationStatus: true
          }
        }
      }
    });

    return user;
  });

  fastify.post('/forgot-password', {
    schema: forgotPasswordSchema,
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } }
  }, async (request, reply) => {
    const email = String(request.body.email || '').trim().toLowerCase();
    const user = await fastify.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isActive: true }
    });

    if (user && user.isActive !== false) {
      // Failures here must not change the response: the generic message below
      // is what keeps this endpoint from confirming which emails are registered.
      try {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await fastify.prisma.passwordResetToken.create({
          data: { token, userId: user.id, expiresAt }
        });
        await fastify.mail.sendPasswordReset(user.email, token);
        await logSecurityEvent(fastify, 'PASSWORD_RESET_REQUESTED', 'LOW', {
          userId: user.id
        });
      } catch (err) {
        fastify.log.error({ err, userId: user.id }, 'Password reset request failed');
      }
    }

    return {
      message:
        'If an account exists for that email, a password reset link has been sent.'
    };
  });

  fastify.post('/reset-password', {
    schema: resetPasswordSchema,
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } }
  }, async (request, reply) => {
    const { token, password } = request.body;

    const row = await fastify.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, isActive: true } } }
    });

    if (!row || row.usedAt || row.expiresAt < new Date() || row.user?.isActive === false) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid or expired reset token'
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await fastify.prisma.$transaction([
      fastify.prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash }
      }),
      fastify.prisma.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() }
      })
    ]);

    await fastify.revokeAllUserRefreshTokens(row.userId);
    await logSecurityEvent(fastify, 'PASSWORD_RESET_COMPLETED', 'MEDIUM', {
      userId: row.userId
    });

    return { message: 'Password updated. You can sign in with your new password.' };
  });
}
