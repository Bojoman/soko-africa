import { NextResponse } from 'next/server';
import { ACCESS_COOKIE } from './app/lib/auth-cookies';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/seller': ['seller', 'admin'],
  '/moderator': ['moderator', 'admin'],
  '/account': ['customer', 'seller', 'admin', 'moderator'],
  '/orders': ['customer', 'seller', 'admin', 'moderator'],
  '/wishlist': ['customer', 'seller', 'admin', 'moderator'],
};

// Routes that should redirect already-authenticated users away
const authRoutes = ['/auth/login', '/auth/register'];

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

// Verifies the access-token cookie against the backend's own introspection
// endpoint (GET /auth/me) rather than duplicating the JWT secret/shape here.
// This is the actual security boundary now — the client-side ProtectedRoute
// component is only a UX nicety for already-authenticated users.
async function getSession(token) {
  if (!token || !API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedPrefix = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!protectedPrefix && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const session = await getSession(token);

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = protectedRoutes[protectedPrefix];
  const role = String(session.role || '').toLowerCase();
  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Next.js BFF routes — these authenticate themselves)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
