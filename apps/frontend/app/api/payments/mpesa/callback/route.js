import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

/**
 * Daraja POSTs STK results here when MPESA_CALLBACK_URL points at the
 * Next.js origin. We forward the raw body + `key` query to the Fastify
 * backend, which owns signature/secret verification.
 */
export async function POST(request) {
  try {
    const incoming = new URL(request.url);
    const key = incoming.searchParams.get('key') || '';
    const body = await request.text();
    const target = new URL(`${API_BASE}/payments/mpesa/callback`);
    if (key) target.searchParams.set('key', key);

    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json'
      },
      body,
      cache: 'no-store'
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json'
      }
    });
  } catch {
    // Always ACK shape Daraja expects if our proxy itself fails — the
    // payment stays INITIATED and status polling / manual review covers it.
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'proxy_error' },
      { status: 200 }
    );
  }
}
