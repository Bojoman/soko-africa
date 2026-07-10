import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const res = await fetch(`${API_BASE}/seller/analytics?range=${encodeURIComponent(range)}`, {
    headers: await proxyAuthHeaders(request)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
