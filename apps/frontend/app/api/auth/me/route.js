import { NextResponse } from 'next/server';
import {
  bearerHeaders,
  getAccessTokenFromCookies
} from '@/lib/auth-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const cookieToken = await getAccessTokenFromCookies();
    const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized', code: 'NO_SESSION' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { ...bearerHeaders(token) },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to get profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const cookieToken = await getAccessTokenFromCookies();
    const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: {
        ...bearerHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
