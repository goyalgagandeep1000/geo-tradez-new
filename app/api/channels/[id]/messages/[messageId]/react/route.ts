import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { parseReactions } from '@/lib/api-utils';
import { mapMessage } from '@/lib/mappers';

const schema = z.object({ emoji: z.string().min(1) });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; messageId: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;
  const { messageId } = await params;
  try {
    const { emoji } = schema.parse(await req.json());
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) return jsonError('Message not found', 404);

    const reactions = parseReactions(message.reactions);
    const existing = reactions.find((r) => r.emoji === emoji);
    const updated = existing
      ? reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
      : [...reactions, { emoji, count: 1 }];

    const updatedMsg = await prisma.message.update({
      where: { id: messageId },
      data: { reactions: JSON.stringify(updated) },
      include: { user: true },
    });
    return jsonOk(mapMessage(updatedMsg));
  } catch {
    return jsonError('Invalid request', 400);
  }
}
