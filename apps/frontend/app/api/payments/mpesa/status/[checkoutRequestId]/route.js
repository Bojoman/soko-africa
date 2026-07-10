import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request, { params }) {
  const { checkoutRequestId } = await params;
  const res = await fetch(
    `${API_BASE}/payments/mpesa/status/${encodeURIComponent(checkoutRequestId)}`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
