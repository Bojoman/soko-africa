import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Filenames are content-addressed (upload hash) or stable seed names.
// Cache the original bytes at the Vercel edge. Do not resize here: a width
// query would re-enter this route on every optimizer miss and wait on Render.
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const NO_STORE = 'private, no-store';

function isPrivateResponse(cacheControl, setCookie) {
  if (setCookie) return true;
  return /(?:^|,)\s*(?:private|no-store)\b/i.test(cacheControl || '');
}

export async function GET(_request, { params }) {
  const { filename } = await params;
  if (
    !filename ||
    filename.includes('/') ||
    filename.includes('\\') ||
    filename.includes('..')
  ) {
    return NextResponse.json(
      { message: 'Invalid filename' },
      { status: 400, headers: { 'Cache-Control': NO_STORE } }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/media/${encodeURIComponent(filename)}`,
      { cache: 'no-store' }
    );

    const contentType = response.headers.get('Content-Type') || '';
    const upstreamCache = response.headers.get('Cache-Control') || '';
    const setCookie = response.headers.get('Set-Cookie');
    const isImage = contentType.startsWith('image/');
    const isFallback = response.headers.get('X-Media-Fallback') === '1';

    if (
      !response.ok ||
      !response.body ||
      !isImage ||
      isPrivateResponse(upstreamCache, setCookie)
    ) {
      return new NextResponse(null, {
        status: response.ok ? 502 : response.status || 502,
        headers: { 'Cache-Control': NO_STORE }
      });
    }

    const bytes = await response.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': isFallback ? 'public, max-age=300' : IMMUTABLE_CACHE
      }
    });
  } catch (error) {
    console.error('Product media proxy error:', error);
    return new NextResponse(null, {
      status: 502,
      headers: { 'Cache-Control': NO_STORE }
    });
  }
}
