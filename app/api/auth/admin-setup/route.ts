import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryNeon } from '@/lib/db/client';
import { getSession } from '@/lib/auth/server';
import { z } from 'zod';

const setupSchema = z.object({
  setupToken: z.string().min(20).max(512).optional(),
  email: z.string().trim().email().max(255),
  password: z.string().min(10).max(128),
  fullName: z.string().trim().min(2).max(255),
});

function safeTokenEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function POST(request: Request) {
  try {
    const parsed = setupSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Enter a valid name, email and password of at least 10 characters.' }, { status: 400 });

    const session = await getSession();
    const adminRows = await queryNeon<{ count: string }>(`SELECT COUNT(*)::text AS count FROM users WHERE role = 'admin'`);
    const adminExists = Number(adminRows[0]?.count ?? 0) > 0;
    const configuredToken = process.env.ADMIN_SETUP_TOKEN;
    const tokenIsValid = Boolean(configuredToken && parsed.data.setupToken && safeTokenEqual(parsed.data.setupToken, configuredToken));

    if (session?.role !== 'admin' && (!tokenIsValid || adminExists)) {
      return NextResponse.json({ error: adminExists ? 'Administrator setup is locked. Sign in as an administrator to manage accounts.' : 'Administrator setup is not configured.' }, { status: 403 });
    }

    const hash = await bcrypt.hash(parsed.data.password, 12);
    await queryNeon(
      `INSERT INTO users (email, password_hash, role, full_name)
       VALUES (lower($1), $2, 'admin', $3)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = 'admin',
           full_name = EXCLUDED.full_name`,
      [parsed.data.email, hash, parsed.data.fullName]
    );

    return NextResponse.json({ ok: true, message: `Administrator account ready for ${parsed.data.email.toLowerCase()}.` });
  } catch {
    return NextResponse.json({ error: 'Unable to create the administrator account.' }, { status: 500 });
  }
}
