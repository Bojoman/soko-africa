/**
 * Optional JWT resolve + ownership checks for payment/checkout flows.
 * Guest orders (userId null) remain payable without a session.
 * Owned orders require the owning authenticated user.
 */

export async function resolveAuthedUserId(request) {
  try {
    await request.jwtVerify();
    return request.user?.sub || null;
  } catch {
    return null;
  }
}

/**
 * @returns {boolean} true if the caller may initiate/continue payment for this order
 */
export function assertOrderPaymentAccess(order, authedUserId, reply) {
  if (!order) {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Order not found'
    });
    return false;
  }

  if (order.userId && order.userId !== authedUserId) {
    if (!authedUserId) {
      reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required to pay for this order'
      });
      return false;
    }
    reply.code(403).send({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Not your order'
    });
    return false;
  }

  return true;
}
