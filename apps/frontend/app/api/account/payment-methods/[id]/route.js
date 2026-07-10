import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/account/payment-methods/${id}`, {
    method: 'DELETE',
    headers: await proxyAuthHeaders(request)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
