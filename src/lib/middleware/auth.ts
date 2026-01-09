import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper function to verify and extract user from token
export function requireAuth(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      username: string;
      roleId: number;
      userType: string;
    };
    return decoded;
  } catch (error) {
    throw new Error('Unauthorized');
  }
}

// Routes that require authentication
const protectedRoutes = ['/admin'];
const authRoutes = ['/auth/admin/login', '/auth/admin/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookie
  const token = request.cookies.get('admin-token')?.value;

  // If accessing protected route
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      const url = new URL('/auth/admin/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        username: string;
        roleId: number;
        userType: string;
      };

      // Check if user has admin role (role_id 1 or 2)
      if (decoded.roleId !== 1 && decoded.roleId !== 2) {
        // Not an admin, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Add user info to headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId.toString());
      requestHeaders.set('x-user-role', decoded.roleId.toString());
      requestHeaders.set('x-username', decoded.username);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // Clear invalid token
      const response = NextResponse.redirect(
        new URL('/auth/admin/login', request.url)
      );
      response.cookies.delete('admin-token');
      return response;
    }
  }

  // If accessing auth route while logged in
  if (isAuthRoute && token) {
    try {
      // Verify token is still valid
      jwt.verify(token, JWT_SECRET);
      
      // Redirect to dashboard if already logged in
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch (error) {
      // Token invalid, allow access to login page
      const response = NextResponse.next();
      response.cookies.delete('admin-token');
      return response;
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
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images|fonts).*)',
  ],
};