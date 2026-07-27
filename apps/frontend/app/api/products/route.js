import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../lib/proxy-auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function readJson(response) {
  return response.json().catch(() => ({}));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const queryString = searchParams.toString();

    const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }
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
  } catch (error) {
    console.error('Products proxy error:', error);
    // Return empty products array as fallback
    return NextResponse.json({
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Product creation proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
