import { NextResponse } from 'next/server';

import { proxyAuthHeaders } from '../../../../lib/proxy-auth';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE}/payments/stripe/create-intent`, {
    method: 'POST',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
