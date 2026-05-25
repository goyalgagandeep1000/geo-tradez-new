import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '@/lib/generated/prisma';

/** Remove ssl query params so they do not overwrite Pool `ssl` config via pg's URL parser. */
export function stripSslQueryParams(url: string): string {
  return url
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/([?&])sslmode=[^&]*/gi, '$1')
    .replace(/([?&])sslcert=[^&]*/gi, '$1')
    .replace(/([?&])sslkey=[^&]*/gi, '$1')
    .replace(/([?&])sslrootcert=[^&]*/gi, '$1')
    .replace(/\?&+/g, '?')
    .replace(/&&+/g, '&')
    .replace(/[?&]$/, '');
}

function isRemotePostgres(connectionString: string) {
  return (
    connectionString.includes('supabase.com') ||
    connectionString.includes('supabase.co') ||
    process.env.NODE_ENV === 'production'
  );
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error('DATABASE_URL is not set');
  }

  const connectionString = stripSslQueryParams(raw);
  const remote = isRemotePostgres(connectionString);

  // Must use a Pool instance — passing PoolConfig + connectionString with sslmode=
  // makes pg parse ssl as {} and ignore rejectUnauthorized: false.
  const pool = new pg.Pool({
    connectionString,
    max: remote ? 3 : 10,
    ...(remote && { ssl: { rejectUnauthorized: false } }),
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
