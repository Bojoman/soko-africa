import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function PATCH(request, ctx) {
  const { id } = await ctx.params;
  const body = await request.json();
  const res = await fetch(`${API_BASE}/cart/items/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request, ctx) {
  const { id } = await ctx.params;
  // No Content-Type: this request has no body, and Fastify rejects
  // `application/json` with an empty body as a 400.
  const res = await fetch(`${API_BASE}/cart/items/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: await proxyAuthHeaders(request)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
