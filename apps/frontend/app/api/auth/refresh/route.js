import { NextResponse } from 'next/server';
import {
  applyAuthCookies,
  getRefreshTokenFromCookies
} from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const cookieRefresh = await getRefreshTokenFromCookies();
    const refreshToken = body.refreshToken || cookieRefresh;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Token refresh failed' },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ ok: true });
    if (data.tokens) {
      applyAuthCookies(res, data.tokens);
    }
    return res;
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
