import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryNeon } from '@/lib/db/client';
import { getSession } from '@/lib/auth/server';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const search = new URL(request.url).searchParams.get('search')?.trim() || '';
    const rows = await queryNeon(`
      SELECT s.id, s.student_id, s.full_name, s.class_name, s.date_of_birth, s.guardian_name,
             s.user_id, u.email
      FROM students s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE $1 = '' OR s.full_name ILIKE '%' || $1 || '%' OR s.student_id ILIKE '%' || $1 || '%'
      ORDER BY s.full_name, s.student_id
    `, [search]);
    return NextResponse.json({ students: rows });
  } catch {
    return NextResponse.json({ error: 'Unable to load pupil records.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();

    if (b.type === 'billing') {
      const amount = Number(b.amount);
      const amountPaid = Number(b.amountPaid || 0);
      if (!b.studentId || !b.session || !b.term || !b.description || !Number.isFinite(amount) || amount < 0 || !Number.isFinite(amountPaid) || amountPaid < 0 || amountPaid > amount) {
        return NextResponse.json({ error: 'Complete the billing details with a valid payment amount.' }, { status: 400 });
      }
      await queryNeon(`INSERT INTO billing_items(student_id,session,term,description,amount,amount_paid,due_date) VALUES($1,$2,$3,$4,$5,$6,$7)`, [b.studentId, b.session, b.term, String(b.description).trim(), amount, amountPaid, b.dueDate || null]);
      return NextResponse.json({ ok: true });
    }

    if (b.type === 'linkLogin') {
      const studentId = String(b.studentId || '').trim();
      const email = String(b.email || '').trim().toLowerCase();
      const password = String(b.password || '');
      if (!studentId || !email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return NextResponse.json({ error: 'Enter a valid email and a password of at least 6 characters.' }, { status: 400 });

      const hash = await bcrypt.hash(password, 12);
      const linked = await queryNeon<{ user_id: string }>(
        `WITH target AS (
           SELECT id, full_name FROM students WHERE id=$1 AND user_id IS NULL FOR UPDATE
         ), new_user AS (
           INSERT INTO users(email,password_hash,role,full_name)
           SELECT $2,$3,'student',full_name FROM target
           RETURNING id
         )
         UPDATE students
         SET user_id=(SELECT id FROM new_user)
         WHERE id=(SELECT id FROM target) AND user_id IS NULL
         RETURNING user_id`,
        [studentId, email, hash]
      );
      if (!linked.length) return NextResponse.json({ error: 'Pupil profile was not found or already has login credentials.' }, { status: 409 });
      return NextResponse.json({ ok: true });
    }

    const fullName = String(b.fullName || '').trim();
    const pupilStudentId = String(b.studentId || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const password = String(b.password || '');
    const className = String(b.className || '').trim();
    if (!fullName || !pupilStudentId || !email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6 || !className) return NextResponse.json({ error: 'Name, student ID, class, valid email and a password of at least 6 characters are required.' }, { status: 400 });
    const hash = await bcrypt.hash(password, 12);
    const created = await queryNeon<{ id: string }>(
      `WITH new_user AS (
         INSERT INTO users(email,password_hash,role,full_name) VALUES($1,$2,'student',$3) RETURNING id
       )
       INSERT INTO students(full_name,student_id,user_id,class_name,date_of_birth,guardian_name)
       SELECT $3,$4,id,$5,$6,$7 FROM new_user
       RETURNING id`,
      [email, hash, fullName, pupilStudentId, className, b.dateOfBirth || null, b.guardianName || null]
    );
    if (!created.length) return NextResponse.json({ error: 'Unable to save the pupil profile.' }, { status: 400 });
    return NextResponse.json({ ok: true, studentId: pupilStudentId });
  } catch (e) {
    const message = String(e).toLowerCase().includes('duplicate') || String(e).toLowerCase().includes('unique') ? 'Student ID or email already exists.' : 'Unable to save the record.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
