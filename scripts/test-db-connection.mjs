import 'dotenv/config';
import { prisma } from '../lib/prisma.ts';

const users = await prisma.user.count();
const products = await prisma.product.count();
console.log(JSON.stringify({ connected: true, users, products }));
await prisma.$disconnect();
