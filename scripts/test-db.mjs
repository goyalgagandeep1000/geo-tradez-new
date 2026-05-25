import 'dotenv/config';
import { prisma } from '../lib/prisma.ts';

const count = await prisma.user.count();
console.log('ok users', count);
await prisma.$disconnect();
