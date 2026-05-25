import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createToken, setAuthCookie, hashPassword, toPublicUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return jsonError('Email already registered', 409);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        name: body.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
        role: 'Seller',
        country: 'United States',
        flag: '🇺🇸',
        bio: '',
      },
    });

    await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });

    const token = await createToken(user.id);
    await setAuthCookie(token);
    return jsonOk({
      user: toPublicUser(user),
      profile: { name: user.name, email: user.email, bio: user.bio || '' },
    });
  } catch {
    return jsonError('Invalid request', 400);
  }
}
