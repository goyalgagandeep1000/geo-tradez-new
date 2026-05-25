import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { toPublicUser } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
});

export async function PATCH(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const body = schema.parse(await req.json());
    const user = await prisma.user.update({
      where: { id: userId! },
      data: body,
    });
    return jsonOk({
      user: toPublicUser(user),
      profile: { name: user.name, email: user.email, bio: user.bio || '' },
    });
  } catch {
    return jsonError('Invalid request', 400);
  }
}
