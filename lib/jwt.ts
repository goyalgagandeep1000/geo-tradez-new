import { SignJWT, jwtVerify } from 'jose';

export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    console.warn('[jwt] JWT_SECRET is not set in production');
  }
  return new TextEncoder().encode(
    secret || 'geotradez-dev-secret-change-in-production'
  );
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecretKey());
  return payload.sub as string | undefined;
}
