import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: await proxyAuthHeaders(request)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
