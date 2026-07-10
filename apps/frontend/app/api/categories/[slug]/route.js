import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Category detail proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
