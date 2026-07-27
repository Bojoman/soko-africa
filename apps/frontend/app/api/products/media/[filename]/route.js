import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(_request, { params }) {
  const { filename } = await params;
  if (!filename || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ message: 'Invalid filename' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/media/${encodeURIComponent(filename)}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok || !response.body) {
      return new NextResponse(null, { status: response.status || 404 });
    }

    const headers = new Headers();
    headers.set(
      'Content-Type',
      response.headers.get('Content-Type') || 'image/png'
    );
    headers.set(
      'Cache-Control',
      response.headers.get('Cache-Control') || 'public, max-age=300'
    );

    return new NextResponse(response.body, { status: 200, headers });
  } catch (error) {
    console.error('Product media proxy error:', error);
    return new NextResponse(null, { status: 502 });
  }
}
