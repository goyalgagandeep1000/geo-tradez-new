import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { diagnoseDatabaseUrl } from '@/lib/database-url';

export const runtime = 'nodejs';

export async function GET() {
  const diagnosis = diagnoseDatabaseUrl(process.env.DATABASE_URL);

  if (!diagnosis.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: 'DATABASE_URL is misconfigured',
        parsedHost: diagnosis.host,
        parsedPort: diagnosis.port,
        hint: diagnosis.hint,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
      { status: 500 }
    );
  }

  try {
    const users = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      database: 'connected',
      users,
      parsedHost: diagnosis.host,
      parsedPort: diagnosis.port,
      usesPooler: diagnosis.usesPooler,
      hasDatabaseUrl: true,
      hasJwtSecret: !!process.env.JWT_SECRET,
    });
  } catch (e) {
    console.error('[health]', e);
    const message = e instanceof Error ? e.message : 'Database error';
    return NextResponse.json(
      {
        ok: false,
        error: message,
        parsedHost: diagnosis.host,
        parsedPort: diagnosis.port,
        hint: message.includes('self-signed certificate')
          ? 'TLS/ssl issue — redeploy latest code (includes Supabase SSL fix) or contact support.'
          : message.includes('at `base`') || diagnosis.host === 'base'
            ? 'Password contains @ — encode as %40 in Vercel DATABASE_URL and redeploy.'
            : 'Check DATABASE_URL on Vercel matches Supabase Transaction pooler (port 6543, pgbouncer=true).',
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
      { status: 500 }
    );
  }
}
