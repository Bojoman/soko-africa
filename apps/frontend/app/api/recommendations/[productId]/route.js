import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(_request, ctx) {
  const { productId } = await ctx.params;
  const res = await fetch(
    `${API_BASE}/recommendations/${encodeURIComponent(productId)}`
  );
  const data = await res.json().catch(() => ({ products: [] }));
  return NextResponse.json(data, { status: res.status });
}
