import { prisma } from '@/lib/db';
import { jsonOk } from '@/lib/api-utils';
import { toPublicUser } from '@/lib/auth';

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatar: true,
      role: true,
      isPro: true,
      country: true,
      flag: true,
      online: true,
    },
    take: 50,
  });
  return jsonOk(users.map(toPublicUser));
}
