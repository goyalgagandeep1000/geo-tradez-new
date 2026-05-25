import { clearAuthCookieOnResponse } from '@/lib/auth';
import { jsonOk } from '@/lib/api-utils';

export const runtime = 'nodejs';

export async function POST() {
  const res = jsonOk({ ok: true });
  return clearAuthCookieOnResponse(res);
}
