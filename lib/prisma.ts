import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma';

function normalizeDatabaseUrl(url: string) {
  if (
    (url.includes('supabase.com') || url.includes('supabase.co')) &&
    !url.includes('sslmode=')
  ) {
    return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
  }
  return url;
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error('DATABASE_URL is not set');
  }
  const connectionString = normalizeDatabaseUrl(raw);
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
