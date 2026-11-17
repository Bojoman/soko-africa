import { cookies } from 'next/headers';

export const ACCESS_COOKIE = 'soko_access';
export const REFRESH_COOKIE = 'soko_refresh';
/** Cookie-only "remember me" flag. The API never sees this. */
export const REMEMBER_COOKIE = 'soko_remember';

const ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const REFRESH_REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function resolveAuthCookieMaxAges(rememberMe = false) {
  return {
    access: ACCESS_MAX_AGE,
    refresh: rememberMe === true ? REFRESH_REMEMBER_MAX_AGE : REFRESH_MAX_AGE
  };
}

function cookieBase() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
  };
}

/**
 * @param {import('next/server').NextResponse} response
 * @param {{ accessToken: string, refreshToken: string }} tokens
 * @param {{ rememberMe?: boolean }} [options]
 * Access stays 15 minutes. Remember me only lengthens the refresh cookie.
 */
export function applyAuthCookies(response, tokens, options = {}) {
  const rememberMe = options.rememberMe === true;
  const maxAges = resolveAuthCookieMaxAges(rememberMe);
  const base = cookieBase();
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: maxAges.access
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: maxAges.refresh
  });
  if (rememberMe) {
    response.cookies.set(REMEMBER_COOKIE, '1', {
      ...base,
      maxAge: maxAges.refresh
    });
  } else {
    response.cookies.set(REMEMBER_COOKIE, '', { ...base, maxAge: 0 });
  }
  return response;
}

/** @param {import('next/server').NextResponse} response */
export function clearAuthCookies(response) {
  const base = cookieBase();
  response.cookies.set(ACCESS_COOKIE, '', { ...base, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...base, maxAge: 0 });
  response.cookies.set(REMEMBER_COOKIE, '', { ...base, maxAge: 0 });
  return response;
}

export async function getAccessTokenFromCookies() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshTokenFromCookies() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

export async function hasRememberMeCookie() {
  const store = await cookies();
  return store.get(REMEMBER_COOKIE)?.value === '1';
}

export function bearerHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
