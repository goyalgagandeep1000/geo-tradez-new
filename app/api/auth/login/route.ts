import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createToken, setAuthCookie, verifyPassword, toPublicUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError('Invalid email or password', 401);
    }
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
