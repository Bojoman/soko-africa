export const GUEST_ORDER_COOKIE = 'soko_guest_orders';
export const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function validGuestToken(token) {
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
}
