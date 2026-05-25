import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'geotradez-token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'geotradez-dev-secret-change-in-production'
);

const protectedPaths = [
  '/discover',
  '/community',
  '/ai-create',
  '/wallet',
  '/settings',
  '/my-store',
  '/learn',
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
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/discover/:path*',
    '/community/:path*',
    '/ai-create/:path*',
    '/wallet/:path*',
    '/settings/:path*',
    '/my-store/:path*',
    '/learn/:path*',
  ],
};
