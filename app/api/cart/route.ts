import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({ productId: z.string() });

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const items = await prisma.cartItem.findMany({ where: { userId: userId! } });
  return jsonOk(items.map((i) => i.productId));
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const { productId } = schema.parse(await req.json());
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return jsonError('Product not found', 404);
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: userId!, productId } },
    });
    if (existing) return jsonOk({ cart: await getCartIds(userId!), alreadyInCart: true });
    await prisma.cartItem.create({ data: { userId: userId!, productId } });
    return jsonOk({ cart: await getCartIds(userId!), alreadyInCart: false });
  } catch {
    return jsonError('Invalid request', 400);
  }
}

async function getCartIds(userId: string) {
  const items = await prisma.cartItem.findMany({ where: { userId } });
  return items.map((i) => i.productId);
}
