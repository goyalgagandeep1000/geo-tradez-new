import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  const n = await prisma.notification.findFirst({ where: { id, userId: userId! } });
  if (!n) return jsonError('Not found', 404);
  await prisma.notification.update({ where: { id }, data: { read: true } });
  return jsonOk({ ok: true });
}
