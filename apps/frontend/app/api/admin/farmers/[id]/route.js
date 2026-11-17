import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request, { params }) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/admin/farmers/${id}`, {
    headers: await proxyAuthHeaders(request),
    cache: 'no-store'
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.text();
  const res = await fetch(`${API_BASE}/admin/farmers/${id}`, {
    method: 'PATCH',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
    body,
    cache: 'no-store'
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
