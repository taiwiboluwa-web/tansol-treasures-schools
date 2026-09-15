import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, type Session } from './session';

const COOKIE = 'tansol_session';

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? verifySession(token) : null;
}

export async function requireRole(roles: Session['role'][]) {
  const session = await getSession();
  if (!session) redirect('/portal');
  if (!roles.includes(session.role)) redirect('/portal');
  return session;
}

export { COOKIE };
