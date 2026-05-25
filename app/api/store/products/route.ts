import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth, jsonOk, jsonError } from '@/lib/api-utils';
import { mapStoreProduct } from '@/lib/mappers';

const createSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  categoryColor: z.string().optional(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  status: z.enum(['Active', 'Draft', 'Paused']).optional(),
});

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;
  const products = await prisma.storeProduct.findMany({
    where: { userId: userId! },
    orderBy: { createdAt: 'desc' },
  });
  return jsonOk(products.map(mapStoreProduct));
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;
  try {
    const body = createSchema.parse(await req.json());
    const product = await prisma.storeProduct.create({
      data: {
        userId: userId!,
        title: body.title,
        category: body.category,
        categoryColor: body.categoryColor || 'bg-gray-100 text-gray-700',
        price: body.price,
        image: body.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
        status: body.status || 'Active',
      },
    });
    return jsonOk(mapStoreProduct(product));
  } catch {
    return jsonError('Invalid request', 400);
  }
}
