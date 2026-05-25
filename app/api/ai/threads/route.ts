import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({ title: z.string().optional() });

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const threads = await prisma.aiThread.findMany({
    where: { userId: userId! },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  });
  return jsonOk(
    threads.map((t) => ({
      id: t.id,
      title: t.title,
      updatedAt: t.updatedAt.toISOString(),
      messages: t.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        time: m.time,
      })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const body = schema.parse(await req.json().catch(() => ({})));
    const thread = await prisma.aiThread.create({
      data: { userId: userId!, title: body.title || 'New Chat' },
    });
    return jsonOk({ id: thread.id, title: thread.title, updatedAt: thread.updatedAt.toISOString(), messages: [] });
  } catch {
    return jsonError('Invalid request', 400);
  }
}
