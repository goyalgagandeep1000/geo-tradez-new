import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/jwt';

const COOKIE_NAME = 'geotradez-token';

const protectedPaths = [
  '/discover',
  '/community',
  '/ai-create',
  '/wallet',
  '/settings',
  '/my-store',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const userId = await verifySessionToken(token);
    if (!userId) throw new Error('Invalid token');
    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: [
    '/discover',
    '/discover/:path*',
    '/community',
    '/community/:path*',
    '/ai-create',
    '/ai-create/:path*',
    '/wallet',
    '/wallet/:path*',
    '/settings',
    '/settings/:path*',
    '/my-store',
    '/my-store/:path*',
  ],
};
