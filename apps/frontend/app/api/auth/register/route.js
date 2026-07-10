import { NextResponse } from 'next/server';
import { applyAuthCookies } from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Registration failed',
          error: data.error,
          details: data.details
        },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ user: data.user });
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
