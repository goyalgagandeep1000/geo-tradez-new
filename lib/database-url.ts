export type DatabaseUrlDiagnosis = {
  valid: boolean;
  host: string | null;
  port: string | null;
  usesPooler: boolean;
  hasSslMode: boolean;
  atSignCount: number;
  hint?: string;
};

/** Diagnose postgres URL without exposing credentials. */
export function diagnoseDatabaseUrl(url: string | undefined): DatabaseUrlDiagnosis {
  if (!url?.trim()) {
    return {
      valid: false,
      host: null,
      port: null,
      usesPooler: false,
      hasSslMode: false,
      atSignCount: 0,
      hint: 'DATABASE_URL is missing.',
    };
  }

  const trimmed = url.trim().replace(/^["']|["']$/g, '');
  const withoutScheme = trimmed.replace(/^postgres(?:ql)?:\/\//i, '');
  const atParts = withoutScheme.split('@');
  const atSignCount = Math.max(0, atParts.length - 1);

  if (atParts.length < 2) {
    return {
      valid: false,
      host: null,
      port: null,
      usesPooler: false,
      hasSslMode: trimmed.includes('sslmode='),
      atSignCount,
      hint: 'Invalid URL: missing @ between password and host.',
    };
  }

  const hostPart = atParts[atParts.length - 1] ?? '';
  const host = hostPart.split(':')[0]?.split('/')[0] ?? null;
  const portMatch = hostPart.match(/:(\d+)/);
  const port = portMatch?.[1] ?? null;
  const usesPooler = trimmed.includes('pgbouncer=true') || port === '6543';
  const hasSslMode = trimmed.includes('sslmode=');

  if (atParts.length > 2) {
    return {
      valid: false,
      host,
      port,
      usesPooler,
      hasSslMode,
      atSignCount,
      hint:
        'Password contains @ — URL-encode it as %40 in Vercel (Settings → Environment Variables). Example: Pass@word → Pass%40word',
    };
  }

  if (!host || !host.includes('.') || host.length < 8) {
    return {
      valid: false,
      host,
      port,
      usesPooler,
      hasSslMode,
      atSignCount,
      hint:
        'Host looks wrong. Copy the full URI from Supabase → Connect → ORMs → Prisma (Transaction pooler for DATABASE_URL).',
    };
  }

  if (host === 'base' || host.endsWith('base')) {
    return {
      valid: false,
      host,
      port,
      usesPooler,
      hasSslMode,
      atSignCount,
      hint:
        'Host parsed as "base" — your password almost certainly has @ in it. Replace every @ in the password with %40 in DATABASE_URL on Vercel.',
    };
  }

  if (host.includes('supabase') && port === '6543' && !trimmed.includes('pgbouncer=true')) {
    return {
      valid: true,
      host,
      port,
      usesPooler,
      hasSslMode,
      atSignCount,
      hint: 'Add ?pgbouncer=true to DATABASE_URL when using port 6543.',
    };
  }

  return {
    valid: true,
    host,
    port,
    usesPooler,
    hasSslMode,
    atSignCount,
  };
}
