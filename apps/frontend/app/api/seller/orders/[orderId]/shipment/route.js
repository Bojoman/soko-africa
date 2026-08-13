import { NextResponse } from 'next/server';

import { proxyAuthHeaders } from '../../../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Record carrier / tracking for this seller's portion of an order. */
export async function POST(request, { params }) {
  const { orderId } = await params;
  const body = await request.text();

  const res = await fetch(
    `${API_BASE}/seller/orders/${encodeURIComponent(orderId)}/shipment`,
    {
      method: 'POST',
      headers: await proxyAuthHeaders(request, {
        'Content-Type': 'application/json'
      }),
      body,
      cache: 'no-store'
    }
  );

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
