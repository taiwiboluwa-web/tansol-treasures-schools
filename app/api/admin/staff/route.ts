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
  const staff = await queryNeon(`SELECT u.id,u.email,u.full_name,u.created_at,sp.staff_id,sp.job_title FROM users u JOIN staff_profiles sp ON sp.user_id=u.id WHERE u.role='staff' ORDER BY u.full_name`);
  return NextResponse.json({ staff });
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
    if (!fullName || !staffId || !email || password.length < 6) return NextResponse.json({ error: 'Name, staff ID, email and a password of at least 6 characters are required.' }, { status: 400 });
    const hash = await bcrypt.hash(password, 12);
    const users = await queryNeon<{ id: string }>(`INSERT INTO users(email,password_hash,role,full_name) VALUES($1,$2,'staff',$3) RETURNING id`, [email, hash, fullName]);
    await queryNeon(`INSERT INTO staff_profiles(user_id,staff_id,job_title) VALUES($1,$2,$3)`, [users[0].id, staffId, jobTitle]);
    return NextResponse.json({ ok: true, staffId });
  } catch (error) {
    const message = String(error).toLowerCase().includes('duplicate') ? 'Staff ID or email already exists.' : 'Unable to create staff account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const userId = String(body.userId || '');
    if (!userId) return NextResponse.json({ error: 'Staff account is required.' }, { status: 400 });
    const fullName = String(body.fullName || '').trim();
    const staffId = String(body.staffId || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const jobTitle = String(body.jobTitle || 'Teacher').trim() || 'Teacher';
    if (!fullName || !staffId || !email) return NextResponse.json({ error: 'Name, staff ID and email are required.' }, { status: 400 });
    await queryNeon(`UPDATE users SET full_name=$1,email=$2 WHERE id=$3 AND role='staff'`, [fullName, email, userId]);
    await queryNeon(`UPDATE staff_profiles SET staff_id=$1,job_title=$2 WHERE user_id=$3`, [staffId, jobTitle, userId]);
    if (body.password) {
      const password = String(body.password);
      if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      const hash = await bcrypt.hash(password, 12);
      await queryNeon(`UPDATE users SET password_hash=$1 WHERE id=$2 AND role='staff'`, [hash, userId]);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = String(error).toLowerCase().includes('duplicate') ? 'Staff ID or email already exists.' : 'Unable to update staff account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
