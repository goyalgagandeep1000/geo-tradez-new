import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { mapStoreProduct } from '@/lib/mappers';

const updateSchema = z.object({
  title: z.string().optional(),
  price: z.number().optional(),
  status: z.enum(['Active', 'Draft', 'Paused']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  try {
    const body = updateSchema.parse(await req.json());
    const existing = await prisma.storeProduct.findFirst({ where: { id, userId: userId! } });
    if (!existing) return jsonError('Product not found', 404);
    const product = await prisma.storeProduct.update({ where: { id }, data: body });
    return jsonOk(mapStoreProduct(product));
  } catch {
    return jsonError('Invalid request', 400);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await prisma.storeProduct.findFirst({ where: { id, userId: userId! } });
  if (!existing) return jsonError('Product not found', 404);
  await prisma.storeProduct.delete({ where: { id } });
  return jsonOk({ ok: true });
}
