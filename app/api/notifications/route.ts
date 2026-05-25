import { prisma } from '@/lib/db';
import { requireAuth, jsonOk } from '@/lib/api-utils';
import { mapNotification } from '@/lib/mappers';

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const notifications = await prisma.notification.findMany({
    where: { userId: userId! },
    orderBy: { createdAt: 'desc' },
  });
  return jsonOk(notifications.map(mapNotification));
}
