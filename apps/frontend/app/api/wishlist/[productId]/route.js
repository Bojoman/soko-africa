import { NextResponse } from 'next/server';

import { proxyAuthHeaders } from '../../../lib/proxy-auth';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request, ctx) {
  const { productId } = await ctx.params;
  const res = await fetch(`${API_BASE}/wishlist/${encodeURIComponent(productId)}`, {
    method: 'POST',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' })
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request, ctx) {
  const { productId } = await ctx.params;
  const res = await fetch(`${API_BASE}/wishlist/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' })
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
