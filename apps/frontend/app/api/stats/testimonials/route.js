import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET() {
  const res = await fetch(`${API_BASE}/stats/testimonials`, { next: { revalidate: 120 } });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
