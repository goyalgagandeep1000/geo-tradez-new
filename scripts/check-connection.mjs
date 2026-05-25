import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

try {
  const [users, products, wallets] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.wallet.count(),
  ]);
  console.log(JSON.stringify({ ok: true, database: 'supabase', users, products, wallets }));
} catch (e) {
  console.log(JSON.stringify({ ok: false, error: e.message }));
} finally {
  await prisma.$disconnect();
}
