import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryNeon } from '@/lib/db/client';
import { createSession } from '@/lib/auth/session';
import { COOKIE } from '@/lib/auth/server';
import { loginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 400 });

    const users = await queryNeon<{ id:string; password_hash:string; role:'admin'|'staff'|'parent'|'student'; full_name:string }>(
      'SELECT id, password_hash, role, full_name FROM users WHERE lower(email) = lower($1) LIMIT 1',
      [parsed.data.identifier]
    );
    const user = users[0];
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await createSession({ userId: user.id, role: user.role, fullName: user.full_name });
    const response = NextResponse.json({ ok: true, role: user.role });
    response.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 });
  }
}
