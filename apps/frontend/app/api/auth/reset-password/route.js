import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    const data = await response.json().catch(() => ({}));
    const res = NextResponse.json(data, { status: response.status });
    if (response.ok) clearAuthCookies(res);
    return res;
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
