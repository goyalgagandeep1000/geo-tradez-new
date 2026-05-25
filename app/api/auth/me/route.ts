import { getSessionUser, toPublicUser } from '@/lib/auth';
import { jsonOk, jsonError } from '@/lib/api-utils';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError('Unauthorized', 401);
  return jsonOk({
    user: toPublicUser(user),
    profile: { name: user.name, email: user.email, bio: user.bio || '' },
  });
}
