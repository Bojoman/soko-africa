import { getAccessTokenFromCookies, bearerHeaders } from './auth-cookies';

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
  }
  const idem = request.headers.get('idempotency-key');
  if (idem) headers['Idempotency-Key'] = idem;
  return headers;
}
