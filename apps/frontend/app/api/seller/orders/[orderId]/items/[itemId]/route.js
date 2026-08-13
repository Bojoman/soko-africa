import { NextResponse } from 'next/server';

import { proxyAuthHeaders } from '../../../../../../lib/proxy-auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Advance one of the seller's own order lines through the fulfillment flow. */
export async function PATCH(request, { params }) {
  const { orderId, itemId } = await params;
  const body = await request.text();

  const res = await fetch(
    `${API_BASE}/seller/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: 'PATCH',
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
