import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || '';
  const res = await fetch(
    `${API_BASE}/coupons/validate?${new URLSearchParams({ code }).toString()}`
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
