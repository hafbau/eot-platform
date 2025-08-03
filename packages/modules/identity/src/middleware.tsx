import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from './supabase';
import { UserRole } from './auth-types';

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

// Role-based access control rules
const roleBasedRoutes: Record<string, UserRole[]> = {
  '/user-management': [UserRole.DIRECTOR, UserRole.ADMIN],
  '/settings': [UserRole.DIRECTOR, UserRole.PROJECT_MANAGER, UserRole.ADMIN],
  // Add more role-based restrictions as needed
};

export async function authMiddleware(request: NextRequest) {
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

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  try {
    // Create Supabase client for server-side auth
    const supabase = createSupabaseServerClient(request.cookies);
    const { data: { session }, error } = await supabase.auth.getSession();

    // If there's an error getting the session, treat as unauthenticated
    if (error) {
      console.error('Auth middleware error:', error);
    }

    const isAuthenticated = !!session?.user;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (!isAuthenticated && isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (isAuthenticated && session?.user) {
      // Get user profile for role information
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const userRole = profile?.role || session.user.user_metadata?.role;

      // Check if route has role restrictions
      const requiredRoles = roleBasedRoutes[pathname];
      if (requiredRoles && userRole && !requiredRoles.includes(userRole as UserRole)) {
        // User doesn't have required role, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Set auth headers for client-side components
    const response = NextResponse.next();
    
    if (session) {
      response.headers.set('x-user-id', session.user.id);
      response.headers.set('x-user-email', session.user.email || '');
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to login for protected routes
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
}

// Utility function to check if a route is protected
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Utility function to check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

// Higher-order component for route protection
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    requiredRoles?: UserRole[];
    redirectTo?: string;
  }
) {
  return function AuthenticatedComponent(props: T) {
    // This would be implemented in the web app using the hooks
    // For now, it's just a placeholder
    return <Component {...props} />;
  };
}