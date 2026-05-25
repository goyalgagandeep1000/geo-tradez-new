import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSessionToken, verifySessionToken } from '@/lib/jwt';
import type { User } from '@/types';

export const COOKIE_NAME = 'geotradez-token';

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function applyAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, authCookieOptions());
  return response;
}

export function clearAuthCookieOnResponse(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME);
  return response;
}
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string) {
  return createSessionToken(userId);
}

export async function verifyToken(token: string) {
  return verifySessionToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, authCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return (await verifyToken(token)) ?? null;
}

export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export function toPublicUser(user: {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isPro: boolean;
  country: string;
  flag: string;
  online: boolean;
  email?: string;
  bio?: string | null;
}): User & { email?: string; bio?: string } {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    isPro: user.isPro,
    country: user.country,
    flag: user.flag,
    online: user.online,
    ...(user.email !== undefined && { email: user.email }),
    ...(user.bio !== undefined && user.bio !== null && { bio: user.bio }),
  };
}

