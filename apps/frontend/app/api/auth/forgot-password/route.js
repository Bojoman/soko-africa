import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const RESET_FAILED = 'Could not send the reset email. Please try again.';
const RESET_GENERIC =
  'If an account exists for that email, a password reset link has been sent.';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const gateway = response.status === 502 || response.status === 504;
      const status = gateway || response.status >= 500 ? 503 : response.status;
      return NextResponse.json({ message: data.message || RESET_FAILED }, { status });
    }
    return NextResponse.json({ message: data.message || RESET_GENERIC });
  } catch {
    return NextResponse.json({ message: RESET_FAILED }, { status: 503 });
  }
}
