import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';
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

function createPgPoolConfig(connectionString: string): PoolConfig {
  const config: PoolConfig = { connectionString };
  // Supabase pooler on Vercel: Node pg needs explicit SSL; default verify fails with
  // "self-signed certificate in certificate chain" on serverless.
  if (
    connectionString.includes('supabase.com') ||
    connectionString.includes('supabase.co') ||
    connectionString.includes('sslmode=require')
  ) {
    config.ssl = { rejectUnauthorized: false };
  }
  return config;
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error('DATABASE_URL is not set');
  }
  const connectionString = normalizeDatabaseUrl(raw);
  const adapter = new PrismaPg(createPgPoolConfig(connectionString));
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
