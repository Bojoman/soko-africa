import { cookies } from 'next/headers';

export const ACCESS_COOKIE = 'soko_access';
export const REFRESH_COOKIE = 'soko_refresh';

const ACCESS_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieBase() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
  };
}

/** @param {import('next/server').NextResponse} response */
export function applyAuthCookies(response, tokens) {
  const base = cookieBase();
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: tokens.expiresIn || ACCESS_MAX_AGE
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: REFRESH_MAX_AGE
  });
  return response;
}

/** @param {import('next/server').NextResponse} response */
export function clearAuthCookies(response) {
  const base = cookieBase();
  response.cookies.set(ACCESS_COOKIE, '', { ...base, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...base, maxAge: 0 });
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

export function bearerHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
