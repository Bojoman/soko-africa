import { NextResponse } from 'next/server';
import { proxyAuthHeaders } from '../../../lib/proxy-auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

/** Proxy multipart product image uploads to the backend with auth cookies. */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const headers = await proxyAuthHeaders(request);
    const response = await fetch(`${API_BASE_URL}/uploads/product-image`, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
