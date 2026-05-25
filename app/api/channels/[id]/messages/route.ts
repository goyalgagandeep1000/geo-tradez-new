import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { mapMessage } from '@/lib/mappers';

const schema = z.object({ content: z.string().min(1) });

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const messages = await prisma.message.findMany({
    where: { channelId: id },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  return jsonOk(messages.map(mapMessage));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  try {
    const { content } = schema.parse(await req.json());
    const channel = await prisma.channel.findUnique({ where: { id } });
    if (!channel) return jsonError('Channel not found', 404);

    const message = await prisma.message.create({
      data: {
        channelId: id,
        userId: userId!,
        content,
        time: nowTime(),
        reactions: '[]',
      },
      include: { user: true },
    });
    return jsonOk({ message: mapMessage(message), channelName: channel.name });
  } catch {
    return jsonError('Invalid request', 400);
  }
}
