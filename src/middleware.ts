import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes pattern
const protectedRoutes = ['/workspace', '/settings', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Check if the path is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  // 2. Check for auth token (mock cookie)
  const token = request.cookies.get('auth_token')?.value;

  if (isProtected && !token) {
    // 3. Redirect to login if not authenticated
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/settings/:path*', '/profile/:path*'],
};
