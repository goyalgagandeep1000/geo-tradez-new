import { prisma } from '@/lib/db';
import { requireAuth, jsonOk } from '@/lib/api-utils';

export async function PATCH() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  await prisma.notification.updateMany({
    where: { userId: userId!, read: false },
    data: { read: true },
  });
  return jsonOk({ ok: true });
}
