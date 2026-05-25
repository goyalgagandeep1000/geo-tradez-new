import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import {
  products,
  storeProducts,
  transactions,
  channels,
  chatMessages,
  courses,
  notifications,
  communityMembers,
  revenueData,
} from '../lib/mockData';

async function main() {
  await prisma.revenueSnapshot.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiThread.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.storeProduct.deleteMany();
  await prisma.course.deleteMany();
  await prisma.product.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const james = await prisma.user.create({
    data: {
      id: '1',
      email: 'james@geotradez.com',
      passwordHash,
      name: 'James Carter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      role: 'Pro Seller',
      isPro: true,
      country: 'United States',
      flag: '🇺🇸',
      bio: 'Pro seller building global digital products.',
      online: true,
    },
  });

  for (const m of communityMembers.filter((u) => u.id !== '1')) {
    await prisma.user.create({
      data: {
        id: m.id,
        email: `${m.name.toLowerCase().replace(/\s+/g, '.')}@geotradez.com`,
        passwordHash,
        name: m.name,
        avatar: m.avatar,
        role: m.role,
        isPro: m.isPro,
        country: m.country,
        flag: m.flag,
        online: m.online ?? false,
      },
    });
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        image: p.image,
        category: p.category,
        categoryColor: p.categoryColor,
        title: p.title,
        seller: p.seller,
        sellerVerified: p.sellerVerified,
        rating: p.rating,
        reviewCount: p.reviewCount,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        badge: p.badge ?? null,
        type: p.type,
        tags: JSON.stringify(p.tags),
      },
    });
  }

  const wallet = await prisma.wallet.create({
    data: { userId: james.id, balance: 2458.3 },
  });

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        date: t.date,
        time: t.time,
        description: t.description,
        accountMask: t.accountMask,
        type: t.type,
        paymentMethod: t.paymentMethod,
        amount: t.amount,
        status: t.status,
        balance: t.balance,
      },
    });
  }

  for (const sp of storeProducts) {
    await prisma.storeProduct.create({
      data: {
        id: sp.id,
        userId: james.id,
        image: sp.image,
        category: sp.category,
        categoryColor: sp.categoryColor,
        title: sp.title,
        price: sp.price,
        rating: sp.rating,
        reviewCount: sp.reviewCount,
        status: sp.status,
      },
    });
  }

  for (const c of courses) {
    await prisma.course.create({
      data: {
        id: c.id,
        thumbnail: c.thumbnail,
        category: c.category,
        title: c.title,
        instructor: c.instructor,
        instructorAvatar: c.instructorAvatar,
        duration: c.duration,
        difficulty: c.difficulty,
        rating: c.rating,
        students: c.students,
        price: c.price === 'Free' ? 'Free' : String(c.price),
      },
    });
  }

  await prisma.enrollment.create({
    data: { userId: james.id, courseId: 'co1', progress: 65 },
  });
  await prisma.enrollment.create({
    data: { userId: james.id, courseId: 'co2', progress: 30 },
  });

  for (const ch of channels) {
    const channel = await prisma.channel.create({
      data: {
        id: ch.id,
        name: ch.name,
        type: ch.type,
        section: ch.section,
        active: ch.active ?? false,
        ownerId: ch.name !== 'Global Chat' ? james.id : null,
      },
    });

    if (ch.name === 'Global Chat') {
      for (const msg of chatMessages) {
        await prisma.message.create({
          data: {
            channelId: channel.id,
            userId: msg.user.id,
            content: msg.content,
            time: msg.time,
            reactions: JSON.stringify(msg.reactions),
            embedIcon: msg.embed?.icon ?? null,
            embedTitle: msg.embed?.title ?? null,
            embedSubtitle: msg.embed?.subtitle ?? null,
          },
        });
      }
    }
  }

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        userId: james.id,
        type: n.type,
        title: n.title,
        description: n.description,
        time: n.time,
        read: n.read,
      },
    });
  }

  await prisma.cartItem.create({ data: { userId: james.id, productId: '2' } });
  await prisma.wishlistItem.create({ data: { userId: james.id, productId: '1' } });
  await prisma.savedItem.create({ data: { userId: james.id, productId: '1' } });
  await prisma.savedItem.create({ data: { userId: james.id, productId: '3' } });

  await prisma.aiThread.create({
    data: {
      id: 'default',
      userId: james.id,
      title: 'New Product Ideas',
      messages: { create: [] },
    },
  });

  for (const r of revenueData) {
    await prisma.revenueSnapshot.create({
      data: { userId: james.id, date: r.date, revenue: r.revenue },
    });
  }

  console.log('Seed complete. Login: james@geotradez.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
