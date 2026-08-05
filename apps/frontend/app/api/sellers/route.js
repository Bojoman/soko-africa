import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../lib/proxy-auth';
import { applyAuthCookies } from '../../lib/auth-cookies';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/sellers${qs ? `?${qs}` : ''}`);
  const data = await res.json().catch(() => ({ sellers: [] }));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE}/sellers`, {
    method: 'POST',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));

  // Becoming a seller changes the caller's role, so the backend hands back a
  // re-issued session. Keep the tokens server-side in httpOnly cookies.
  const { tokens, ...seller } = data;
  const response = NextResponse.json(seller, { status: res.status });
  if (res.ok && tokens) {
    applyAuthCookies(response, tokens);
  }
  return response;
}