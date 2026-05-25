import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/api-utils';
import { jsonOk } from '@/lib/api-utils';
import { toPublicUser } from '@/lib/auth';
import {
  mapProduct,
  mapTransaction,
  mapNotification,
  mapChannel,
  mapMessage,
  mapStoreProduct,
  mapCourse,
} from '@/lib/mappers';

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId! },
    include: {
      wallet: { include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } } },
      cartItems: true,
      wishlistItems: true,
      savedItems: true,
      notifications: { orderBy: { createdAt: 'desc' } },
      enrollments: true,
      storeProducts: true,
      aiThreads: {
        include: { messages: { orderBy: { createdAt: 'asc' } } },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  const channels = await prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });
  const globalChannel = channels.find((c) => c.name === 'Global Chat');
  const messages = globalChannel
    ? await prisma.message.findMany({
        where: { channelId: globalChannel.id },
        include: { user: true },
        orderBy: { createdAt: 'asc' },
      })
    : [];

  const communityByChannel: Record<string, ReturnType<typeof mapMessage>[]> = {};
  for (const ch of channels) {
    const chMsgs = ch.id === globalChannel?.id
      ? messages
      : await prisma.message.findMany({
          where: { channelId: ch.id },
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        });
    communityByChannel[ch.name] = chMsgs.map(mapMessage);
  }

  const revenue = await prisma.revenueSnapshot.findMany({
    where: { userId: userId! },
    orderBy: { date: 'asc' },
  });

  return jsonOk({
    user: toPublicUser(user),
    profile: { name: user.name, email: user.email, bio: user.bio || '' },
    cart: user.cartItems.map((c) => c.productId),
    wishlist: user.wishlistItems.map((w) => w.productId),
    savedItems: user.savedItems.map((s) => s.productId),
    walletBalance: user.wallet?.balance ?? 0,
    transactions: (user.wallet?.transactions ?? []).map(mapTransaction),
    notifications: user.notifications.map(mapNotification),
    enrolledCourses: user.enrollments.map((e) => ({
      courseId: e.courseId,
      progress: e.progress,
    })),
    storeProducts: user.storeProducts.map(mapStoreProduct),
    channels: channels.map(mapChannel),
    communityMessages: communityByChannel,
    aiThreads: user.aiThreads.map((t) => ({
      id: t.id,
      title: t.title,
      updatedAt: t.updatedAt.toISOString(),
      messages: t.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        time: m.time,
      })),
    })),
    revenueData: revenue.map((r) => ({ date: r.date, revenue: r.revenue })),
  });
}
