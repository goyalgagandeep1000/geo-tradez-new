import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { mapChannel } from '@/lib/mappers';

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(['text', 'voice', 'announcement']).default('text'),
  section: z.string().default('CUSTOM CHANNELS'),
});

export async function GET() {
  const channels = await prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });
  return jsonOk(channels.map(mapChannel));
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const body = schema.parse(await req.json());
    const channel = await prisma.channel.create({
      data: {
        name: body.name,
        type: body.type,
        section: body.section,
        ownerId: userId!,
      },
    });
    return jsonOk(mapChannel(channel));
  } catch {
    return jsonError('Invalid request', 400);
  }
}
