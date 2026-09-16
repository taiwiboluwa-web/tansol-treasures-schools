import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth/server';
import { queryNeon } from '@/lib/db/client';

async function requireAdmin() {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const staff = await queryNeon(`SELECT u.id,u.email,u.full_name,u.created_at,sp.staff_id,sp.job_title FROM users u JOIN staff_profiles sp ON sp.user_id=u.id WHERE u.role='staff' ORDER BY u.full_name`);
    return NextResponse.json({ staff });
  } catch {
    return NextResponse.json({ error: 'Unable to load staff records.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const fullName = String(body.fullName || '').trim();
    const staffId = String(body.staffId || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const jobTitle = String(body.jobTitle || 'Teacher').trim() || 'Teacher';
    const password = String(body.password || '');
    if (!fullName || !staffId || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return NextResponse.json({ error: 'Name, staff ID, valid email and a password of at least 6 characters are required.' }, { status: 400 });
    const hash = await bcrypt.hash(password, 12);
    const created = await queryNeon<{ staff_id: string }>(
      `WITH new_user AS (
         INSERT INTO users(email,password_hash,role,full_name) VALUES($1,$2,'staff',$3) RETURNING id
       )
       INSERT INTO staff_profiles(user_id,staff_id,job_title)
       SELECT id,$4,$5 FROM new_user
       RETURNING staff_id`,
      [email, hash, fullName, staffId, jobTitle]
    );
    if (!created.length) return NextResponse.json({ error: 'Unable to create staff account.' }, { status: 400 });
    return NextResponse.json({ ok: true, staffId });
  } catch (error) {
    const message = String(error).toLowerCase().includes('duplicate') || String(error).toLowerCase().includes('unique') ? 'Staff ID or email already exists.' : 'Unable to create staff account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const userId = String(body.userId || '').trim();
    if (!userId) return NextResponse.json({ error: 'Staff account is required.' }, { status: 400 });
    const fullName = String(body.fullName || '').trim();
    const staffId = String(body.staffId || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const jobTitle = String(body.jobTitle || 'Teacher').trim() || 'Teacher';
    if (!fullName || !staffId || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Name, staff ID and a valid email are required.' }, { status: 400 });
    const password = body.password == null ? '' : String(body.password);
    if (password && password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });

    const hash = password ? await bcrypt.hash(password, 12) : null;
    const updated = await queryNeon<{ id: string }>(
      `WITH updated_user AS (
         UPDATE users
         SET full_name=$1,email=$2,password_hash=COALESCE($3,password_hash)
         WHERE id=$4 AND role='staff'
         RETURNING id
       )
       UPDATE staff_profiles
       SET staff_id=$5,job_title=$6
       WHERE user_id=(SELECT id FROM updated_user)
       RETURNING user_id AS id`,
      [fullName, email, hash, userId, staffId, jobTitle]
    );
    if (!updated.length) return NextResponse.json({ error: 'Staff account not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = String(error).toLowerCase().includes('duplicate') || String(error).toLowerCase().includes('unique') ? 'Staff ID or email already exists.' : 'Unable to update staff account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
