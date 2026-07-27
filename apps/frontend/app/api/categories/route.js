import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      next: { revalidate: 120 }
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
