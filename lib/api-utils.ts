import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function requireAuth() {
  const userId = await getSessionUserId();
  if (!userId) return { userId: null as null, error: jsonError('Unauthorized', 401) };
  return { userId, error: null };
}

export function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseReactions(reactions: string): { emoji: string; count: number }[] {
  try {
    const parsed = JSON.parse(reactions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
