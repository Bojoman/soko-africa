import { getAccessTokenFromCookies, getRefreshTokenFromCookies, bearerHeaders } from './auth-cookies';
import { GUEST_ORDER_COOKIE, validGuestToken } from './guest-session';

/**
 * Headers for Next.js BFF routes proxying to the Fastify backend.
 * Forwards the httpOnly session cookie when the browser did not send Authorization.
 */
export async function proxyAuthHeaders(request, extra = {}) {
  const headers = { ...extra };
  const headerAuth = request.headers.get('authorization');
  if (headerAuth) {
    headers.Authorization = headerAuth;
  } else {
    const token = await getAccessTokenFromCookies();
    Object.assign(headers, bearerHeaders(token));
    if (!token && await getRefreshTokenFromCookies()) {
      // An expired account session must trigger the client's refresh/retry,
      // never silently turn an account checkout into a guest purchase.
      headers.Authorization = 'Bearer session-refresh-required';
    }
  }
  const idem = request.headers.get('idempotency-key');
  if (idem) headers['Idempotency-Key'] = idem;
  // Only the private browser cookie supplies guest access to the BFF.
  const guestToken = request.cookies.get(GUEST_ORDER_COOKIE)?.value;
  if (validGuestToken(guestToken)) headers['X-Guest-Order-Token'] = guestToken;
  return headers;
}
