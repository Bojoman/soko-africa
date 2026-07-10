import { NextResponse } from 'next/server';

import { proxyAuthHeaders } from '../../../lib/proxy-auth';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request, ctx) {
  const { id } = await ctx.params;
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' })
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
