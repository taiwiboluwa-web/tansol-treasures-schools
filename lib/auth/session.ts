import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error('SESSION_SECRET is not configured');
const key = new TextEncoder().encode(secret);

export type Session = { userId: string; role: 'admin'|'staff'|'parent'|'student'; fullName: string };

export async function createSession(session: Session) {
  return new SignJWT(session).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(key);
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    if (typeof payload.userId !== 'string' || typeof payload.role !== 'string' || typeof payload.fullName !== 'string') return null;
    if (!['admin','staff','parent','student'].includes(payload.role)) return null;
    return { userId: payload.userId, role: payload.role as Session['role'], fullName: payload.fullName };
  } catch { return null; }
}
