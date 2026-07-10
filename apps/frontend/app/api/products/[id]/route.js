import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../lib/proxy-auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product detail proxy error:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  const params = await context.params;
  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request, context) {
  const params = await context.params;
  const { id } = params;
  const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: await proxyAuthHeaders(request)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
