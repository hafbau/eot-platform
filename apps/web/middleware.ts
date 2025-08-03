import { type NextRequest, NextResponse } from 'next/server';

// Mock-aware auth middleware for testing
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/claims',
    '/delays',
    '/evidence',
    '/schedule',
    '/settings',
    '/user-management',
  ];

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/auth',
    '/forgot-password',
    '/reset-password',
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // For mock authentication, check if user has authentication cookie/header
  // This is a simplified check - in a real app, you'd validate the token
  const authHeader = request.headers.get('authorization');
  const authCookie = request.cookies.get('auth-token');
  
  // Mock: Consider user authenticated if they have any auth indication
  // In real implementation, this would validate JWT tokens
  const isAuthenticated = !!(authHeader || authCookie);

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle root route
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};