/**
 * Shared helper for writing to the SecurityEvent audit table. Never throws —
 * a logging failure must not take down the request that triggered it.
 */
export async function logSecurityEvent(fastify, type, severity, details, ipAddress) {
  try {
    await fastify.prisma.securityEvent.create({
      data: { type, severity, details, ipAddress: ipAddress || undefined }
    });
  } catch (err) {
    fastify.log.error({ err }, 'Failed to log security event');
  }
}
