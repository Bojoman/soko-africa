import { NextResponse } from 'next/server';
import {
  bearerHeaders,
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies
} from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const accessToken = await getAccessTokenFromCookies();
    const refreshToken = await getRefreshTokenFromCookies();

    if (accessToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders(accessToken)
        },
        body: JSON.stringify({ refreshToken: refreshToken || undefined }),
        cache: 'no-store'
      }).catch(() => {});
    }

    const res = NextResponse.json({ message: 'Logged out' });
    clearAuthCookies(res);
    return res;
  } catch {
    const res = NextResponse.json({ message: 'Logged out' });
    clearAuthCookies(res);
    return res;
  }
}
