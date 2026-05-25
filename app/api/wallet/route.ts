import { prisma } from '@/lib/db';
import { requireAuth, jsonOk } from '@/lib/api-utils';
import { mapTransaction } from '@/lib/mappers';

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const wallet = await prisma.wallet.findUnique({
    where: { userId: userId! },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  });
  return jsonOk({
    balance: wallet?.balance ?? 0,
    transactions: (wallet?.transactions ?? []).map(mapTransaction),
  });
}
