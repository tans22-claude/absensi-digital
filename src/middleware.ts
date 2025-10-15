/**
 * Next.js Middleware
 * Handles authentication, authorization, and security headers
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // Rate limiting
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // CSRF protection for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const origin = req.headers.get('origin');
      const host = req.headers.get('host');
      
      if (origin && !origin.includes(host || '')) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Role-based access control
    if (path.startsWith('/admin')) {
      if (token?.role !== 'SUPERADMIN' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    if (path.startsWith('/teacher')) {
      if (token?.role !== 'TEACHER' && token?.role !== 'ADMIN' && token?.role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths
        if (
          path.startsWith('/auth') ||
          path === '/' ||
          path.startsWith('/api/auth') ||
          path.startsWith('/_next') ||
          path.startsWith('/favicon')
        ) {
          return true;
        }

        // Require authentication for all other paths
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
