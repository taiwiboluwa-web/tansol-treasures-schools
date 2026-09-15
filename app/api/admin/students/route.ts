import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryNeon } from '@/lib/db/client';
import { getSession } from '@/lib/auth/server';

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await queryNeon(`
    SELECT s.id, s.student_id, s.class_name, s.date_of_birth, s.guardian_name,
           s.user_id, u.full_name, u.email
    FROM students s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY COALESCE(u.full_name, s.student_id)
  `);
  return NextResponse.json({ students: rows });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();

    if (b.type === 'billing') {
      if (!b.studentId || !b.session || !b.term || !b.description || Number(b.amount) < 0) return NextResponse.json({ error: 'Complete the billing details.' }, { status: 400 });
      await queryNeon(`INSERT INTO billing_items(student_id,session,term,description,amount,amount_paid,due_date) VALUES($1,$2,$3,$4,$5,$6,$7)`, [b.studentId, b.session, b.term, b.description, Number(b.amount), Number(b.amountPaid || 0), b.dueDate || null]);
      return NextResponse.json({ ok: true });
    }

    if (b.type === 'linkLogin') {
      const studentId = String(b.studentId || '').trim();
      const email = String(b.email || '').trim().toLowerCase();
      const password = String(b.password || '');
      if (!studentId || !email || password.length < 6) return NextResponse.json({ error: 'Email and a password of at least 6 characters are required.' }, { status: 400 });

      const existing = await queryNeon<{ user_id: string | null; full_name: string }>(`SELECT s.user_id, COALESCE(u.full_name, '') AS full_name FROM students s LEFT JOIN users u ON u.id=s.user_id WHERE s.id=$1 LIMIT 1`, [studentId]);
      if (!existing.length) return NextResponse.json({ error: 'Pupil profile not found.' }, { status: 404 });
      if (existing[0].user_id) return NextResponse.json({ error: 'This pupil already has login credentials. Use the existing student account to reset them.' }, { status: 409 });

      const hash = await bcrypt.hash(password, 12);
      const linked = await queryNeon<{ user_id: string }>(
        `WITH new_user AS (
           INSERT INTO users(email,password_hash,role,full_name)
           VALUES($1,$2,'student',$3)
           RETURNING id
         )
         UPDATE students
         SET user_id=(SELECT id FROM new_user)
         WHERE id=$4 AND user_id IS NULL
         RETURNING user_id`,
        [email, hash, existing[0].full_name || 'Student', studentId]
      );
      if (!linked.length) return NextResponse.json({ error: 'Could not link the pupil login.' }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    const fullName = String(b.fullName || '').trim();
    const pupilStudentId = String(b.studentId || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const password = String(b.password || '');
    const className = String(b.className || '').trim();
    if (!fullName || !pupilStudentId || !email || password.length < 6 || !className) return NextResponse.json({ error: 'Name, student ID, email, class and a password of at least 6 characters are required.' }, { status: 400 });
    const hash = await bcrypt.hash(password, 12);
    const users = await queryNeon<{ id: string }>(`INSERT INTO users(email,password_hash,role,full_name) VALUES($1,$2,'student',$3) RETURNING id`, [email, hash, fullName]);
    await queryNeon(`INSERT INTO students(student_id,user_id,class_name,date_of_birth,guardian_name) VALUES($1,$2,$3,$4,$5)`, [pupilStudentId, users[0].id, className, b.dateOfBirth || null, b.guardianName || null]);
    return NextResponse.json({ ok: true, studentId: pupilStudentId });
  } catch (e) {
    const message = String(e).includes('duplicate') || String(e).includes('unique') ? 'Student ID or email already exists.' : 'Unable to save the record.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
