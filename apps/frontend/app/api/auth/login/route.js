import { NextResponse } from 'next/server';
import { applyAuthCookies } from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SIGN_IN_OUTAGE = 'Sign-in is temporarily unavailable. Please try again.';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const rememberMe = body?.rememberMe === true;

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body?.email,
        password: body?.password
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const gateway = response.status === 502 || response.status === 504;
      const message =
        data.message ||
        (response.status === 401
          ? 'Invalid credentials'
          : gateway || response.status >= 500
            ? SIGN_IN_OUTAGE
            : 'Login failed');
      return NextResponse.json(
        { message },
        { status: gateway ? 503 : response.status }
      );
    }

    const res = NextResponse.json({ user: data.user });
    if (data.tokens) {
      applyAuthCookies(res, data.tokens, { rememberMe });
    }
    return res;
  } catch {
    return NextResponse.json({ message: SIGN_IN_OUTAGE }, { status: 503 });
  }
}
