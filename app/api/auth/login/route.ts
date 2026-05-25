import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import {
  createToken,
  verifyPassword,
  toPublicUser,
  applyAuthCookie,
} from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-utils';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
    return jsonError('Invalid email or password format', 400);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return jsonError('Invalid email or password', 401);
    }
    const token = await createToken(user.id);
    const res = jsonOk({
      user: toPublicUser(user),
      profile: { name: user.name, email: user.email, bio: user.bio || '' },
    });
    return applyAuthCookie(res, token);
  } catch (e) {
    console.error('[auth/login]', e);
    return jsonError(
      'Server error. Check DATABASE_URL on Vercel and seed the database.',
      500
    );
  }
}
