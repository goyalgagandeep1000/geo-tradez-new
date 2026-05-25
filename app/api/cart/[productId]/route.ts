import { prisma } from '@/lib/db';
import { requireAuth, jsonOk } from '@/lib/api-utils';

export async function DELETE(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { productId } = await params;
  await prisma.cartItem.deleteMany({ where: { userId: userId!, productId } });
  const items = await prisma.cartItem.findMany({ where: { userId: userId! } });
  return jsonOk(items.map((i) => i.productId));
}
