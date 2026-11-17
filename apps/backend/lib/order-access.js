import { createHash, timingSafeEqual } from 'node:crypto';
import { resolveAccessSession } from './access-session.js';

export const resolveAuthedUserId = resolveAccessSession;
export const GUEST_ACCESS_DAYS = 30;
export const orderAccessSelect = {
  id: true,
  userId: true,
  guestAccessTokenHash: true,
  guestAccessExpiresAt: true
};

export function guestTokenHash(request) {
  const token = request.headers['x-guest-order-token'];
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token)
    ? createHash('sha256').update(token).digest('hex')
    : null;
}

export function canAccessOrder(order, userId, request) {
  if (!order) return false;
  if (order.userId) return order.userId === userId;
  const hash = guestTokenHash(request);
  if (!hash || !order.guestAccessTokenHash ||
      !order.guestAccessExpiresAt || new Date(order.guestAccessExpiresAt) <= new Date()) {
    return false;
  }
  const expected = Buffer.from(order.guestAccessTokenHash, 'hex');
  const actual = Buffer.from(hash, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function assertOrderPaymentAccess(order, userId, reply, request) {
  if (canAccessOrder(order, userId, request)) return true;
  // Do not disclose whether another customer's order exists.
  reply.code(404).send({ message: 'Order not found or access expired' });
  return false;
}

export function assertOrderPayable(order, reply) {
  if (['PENDING_PAYMENT', 'FAILED'].includes(order.status)) return true;
  reply.code(409).send({ message: 'Order is not awaiting payment' });
  return false;
}
