import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { GUEST_ORDER_COOKIE, GUEST_COOKIE_MAX_AGE, validGuestToken } from '../../../lib/guest-session';

// Establish the cookie before creating an order. Retries after a lost order
// response then retain the same private credential and idempotency scope.
export async function POST(request) {
  const response = NextResponse.json({ ok: true }, {
    headers: { 'Cache-Control': 'no-store' }
  });
  if (!validGuestToken(request.cookies.get(GUEST_ORDER_COOKIE)?.value)) {
    response.cookies.set(GUEST_ORDER_COOKIE, randomBytes(32).toString('hex'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GUEST_COOKIE_MAX_AGE
    });
  }
  return response;
}
