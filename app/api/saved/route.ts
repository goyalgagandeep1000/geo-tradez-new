import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({ productId: z.string() });

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const { productId } = schema.parse(await req.json());
    const existing = await prisma.savedItem.findUnique({
      where: { userId_productId: { userId: userId!, productId } },
    });
    if (existing) {
      await prisma.savedItem.delete({ where: { id: existing.id } });
    } else {
      await prisma.savedItem.create({ data: { userId: userId!, productId } });
    }
    const items = await prisma.savedItem.findMany({ where: { userId: userId! } });
    return jsonOk(items.map((i) => i.productId));
  } catch {
    return jsonError('Invalid request', 400);
  }
}
