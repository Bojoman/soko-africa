import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../lib/proxy-auth';

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
  return NextResponse.json(data, { status: res.status });
}