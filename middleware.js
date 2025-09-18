import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/seller': ['seller', 'admin'],
  '/moderator': ['moderator', 'admin'],
  '/account': ['customer', 'seller', 'admin', 'moderator'],
  '/orders': ['customer', 'seller', 'admin', 'moderator'],
  '/wishlist': ['customer', 'seller', 'admin', 'moderator'],
};

// Routes that should redirect authenticated users
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // For now, let the client-side authentication handle the redirects
  // This prevents server-side redirect loops
  // The ProtectedRoute component will handle authentication checks
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
