import type { Product, Course, Transaction, Message, Channel, Notification, StoreProduct } from '@/types';
import { parseReactions, parseTags } from '@/lib/api-utils';

type DbProduct = {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  seller: string;
  sellerVerified: boolean;
  rating: number;
  reviewCount: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  type: string;
  tags: string;
};

export function mapProduct(p: DbProduct): Product {
  return {
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
    originalPrice: p.originalPrice ?? undefined,
    badge: (p.badge as Product['badge']) ?? undefined,
    type: p.type as Product['type'],
    tags: parseTags(p.tags),
  };
}

export function mapStoreProduct(p: {
  id: string;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: string;
  status: string;
}): StoreProduct {
  return {
    id: p.id,
    image: p.image,
    category: p.category,
    categoryColor: p.categoryColor,
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviewCount: p.reviewCount,
    status: p.status as StoreProduct['status'],
  };
}

export function mapCourse(
  c: {
    id: string;
    thumbnail: string;
    category: string;
    title: string;
    instructor: string;
    instructorAvatar: string;
    duration: string;
    difficulty: string;
    rating: number;
    students: string;
    price: string;
  },
  enrollment?: { progress: number } | null
): Course {
  const priceVal = c.price === 'Free' ? 'Free' : parseFloat(c.price);
  return {
    id: c.id,
    thumbnail: c.thumbnail,
    category: c.category,
    title: c.title,
    instructor: c.instructor,
    instructorAvatar: c.instructorAvatar,
    duration: c.duration,
    difficulty: c.difficulty as Course['difficulty'],
    rating: c.rating,
    students: c.students,
    price: isNaN(priceVal as number) ? 'Free' : (priceVal as number),
    enrolled: !!enrollment,
    progress: enrollment?.progress,
  };
}

export function mapTransaction(t: {
  id: string;
  date: string;
  time: string;
  description: string;
  accountMask: string;
  type: string;
  paymentMethod: string;
  amount: number;
  status: string;
  balance: number;
}): Transaction {
  return {
    id: t.id,
    date: t.date,
    time: t.time,
    description: t.description,
    accountMask: t.accountMask,
    type: t.type as Transaction['type'],
    paymentMethod: t.paymentMethod as Transaction['paymentMethod'],
    amount: t.amount,
    status: t.status as Transaction['status'],
    balance: t.balance,
  };
}

export function mapMessage(m: {
  id: string;
  content: string;
  time: string;
  reactions: string;
  embedIcon: string | null;
  embedTitle: string | null;
  embedSubtitle: string | null;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isPro: boolean;
    country: string;
    flag: string;
    online: boolean;
  };
}): Message {
  return {
    id: m.id,
    user: {
      id: m.user.id,
      name: m.user.name,
      avatar: m.user.avatar,
      role: m.user.role,
      isPro: m.user.isPro,
      country: m.user.country,
      flag: m.user.flag,
      online: m.user.online,
    },
    content: m.content,
    time: m.time,
    reactions: parseReactions(m.reactions),
    ...(m.embedTitle && {
      embed: {
        icon: m.embedIcon || 'N',
        title: m.embedTitle,
        subtitle: m.embedSubtitle || '',
      },
    }),
  };
}

export function mapChannel(c: {
  id: string;
  name: string;
  type: string;
  section: string;
  active: boolean;
}): Channel {
  return {
    id: c.id,
    name: c.name,
    type: c.type as Channel['type'],
    section: c.section,
    active: c.active,
  };
}

export function mapNotification(n: {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}): Notification {
  return {
    id: n.id,
    type: n.type as Notification['type'],
    title: n.title,
    description: n.description,
    time: n.time,
    read: n.read,
  };
}
