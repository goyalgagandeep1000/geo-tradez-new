import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  const thread = await prisma.aiThread.findFirst({ where: { id, userId: userId! } });
  if (!thread) return jsonError('Thread not found', 404);
  await prisma.aiMessage.deleteMany({ where: { threadId: id } });
  return jsonOk({ ok: true });
}
