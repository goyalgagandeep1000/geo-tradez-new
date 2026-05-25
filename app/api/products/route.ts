import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { jsonOk } from '@/lib/api-utils';
import { mapProduct } from '@/lib/mappers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase();
  const category = searchParams.get('category');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  let filtered = products.map(mapProduct);
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }

  return jsonOk(filtered);
}
