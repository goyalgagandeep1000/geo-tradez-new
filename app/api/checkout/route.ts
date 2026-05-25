import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';

const schema = z.object({
  productIds: z.array(z.string()).optional(),
  productId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const body = schema.parse(await req.json());
    const ids = body.productIds ?? (body.productId ? [body.productId] : []);
    if (ids.length === 0) return jsonError('No products to checkout', 400);

    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const total = products.reduce((sum, p) => sum + p.price, 0);

    await prisma.cartItem.deleteMany({
      where: { userId: userId!, productId: { in: ids } },
    });

    await prisma.notification.create({
      data: {
        userId: userId!,
        type: 'order',
        title: 'Order Confirmed',
        description: `${products.length} item(s) purchased for $${total.toFixed(2)}`,
        time: 'Just now',
        read: false,
      },
    });

    const items = await prisma.cartItem.findMany({ where: { userId: userId! } });
    return jsonOk({
      orderTotal: total,
      cart: items.map((i) => i.productId),
    });
  } catch {
    return jsonError('Invalid request', 400);
  }
}
