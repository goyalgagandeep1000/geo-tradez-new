import { prisma } from '@/lib/db';
import { jsonOk, jsonError } from '@/lib/api-utils';
import { mapProduct } from '@/lib/mappers';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return jsonError('Product not found', 404);
  return jsonOk(mapProduct(product));
}
