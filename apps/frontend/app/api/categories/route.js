import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Uses request URL query params, so force dynamic route execution.
export const dynamic = 'force-dynamic';

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/categories${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const data = await readJson(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || `Backend returned status ${response.status}`,
          error: data.error,
          retryAfter: data.retryAfter
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
