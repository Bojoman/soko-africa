import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/sellers/${encodeURIComponent(slug)}/products${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to load seller products' },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Seller products proxy error:', error);
    return NextResponse.json(
      { products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } },
      { status: 500 }
    );
  }
}
