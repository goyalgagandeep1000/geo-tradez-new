import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  createToken,
  hashPassword,
  toPublicUser,
  applyAuthCookie,
} from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-utils';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Please check email, password (6+ chars), and name', 400);
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return jsonError('Email already registered', 409);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        name: parsed.data.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(parsed.data.name)}`,
        role: 'Seller',
        country: 'United States',
        flag: '🇺🇸',
        bio: '',
      },
    });

    await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });

    const token = await createToken(user.id);
    const res = jsonOk({
      user: toPublicUser(user),
      profile: { name: user.name, email: user.email, bio: user.bio || '' },
    });
    return applyAuthCookie(res, token);
  } catch (e) {
    console.error('[auth/register]', e);
    return jsonError(
      'Server error. Check DATABASE_URL on Vercel and seed the database.',
      500
    );
  }
}
