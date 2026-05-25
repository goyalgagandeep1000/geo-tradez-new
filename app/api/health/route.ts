import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const users = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      database: 'connected',
      users,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
    });
  } catch (e) {
    console.error('[health]', e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : 'Database error',
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      { status: 500 }
    );
  }
}
