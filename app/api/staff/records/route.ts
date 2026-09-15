import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { queryNeon } from '@/lib/db/client';

export async function GET() {
  const s = await getSession();
  if (!s || !['staff', 'admin'].includes(s.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const students = await queryNeon(`
    SELECT s.id, s.student_id, s.full_name, s.class_name, s.user_id, u.email
    FROM students s
    LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.class_name, s.full_name
  `);
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || !['staff', 'admin'].includes(s.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();

    if (b.type === 'pupil') {
      const fullName = String(b.fullName || '').trim();
      const studentId = String(b.studentId || '').trim();
      const className = String(b.className || '').trim();
      if (!fullName || !studentId || !className) return NextResponse.json({ error: 'Pupil name, student ID and class are required.' }, { status: 400 });
      await queryNeon(
        `INSERT INTO students(student_id,user_id,class_name,date_of_birth,guardian_name)
         VALUES($1,NULL,$2,$3,$4)`,
        [studentId, className, b.dateOfBirth || null, b.guardianName || null]
      );
      return NextResponse.json({ ok: true, studentId });
    }

    if (b.type === 'result') {
      const ca = Number(b.ca), exam = Number(b.exam);
      if (!b.studentId || !b.session || !b.term || !b.subject || ca < 0 || ca > 40 || exam < 0 || exam > 60) return NextResponse.json({ error: 'Invalid result details.' }, { status: 400 });
      const student = await queryNeon<{ student_id: string }>(`SELECT student_id FROM students WHERE id=$1`, [b.studentId]);
      if (!student.length) return NextResponse.json({ error: 'Pupil not found.' }, { status: 404 });
      const total = ca + exam;
      const grade = total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : total >= 40 ? 'D' : 'F';
      await queryNeon(
        `INSERT INTO results(student_id,session,term,subject,ca_score,exam_score,grade,remark,is_published)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,false)
         ON CONFLICT(student_id,session,term,subject)
         DO UPDATE SET ca_score=EXCLUDED.ca_score,exam_score=EXCLUDED.exam_score,grade=EXCLUDED.grade,remark=EXCLUDED.remark,updated_at=CURRENT_TIMESTAMP`,
        [student[0].student_id, b.session, b.term, b.subject, ca, exam, grade, b.remark || null]
      );
      return NextResponse.json({ ok: true, total, grade });
    }

    if (b.type === 'attendance') {
      if (!b.studentId || !b.date || !['present', 'absent', 'late'].includes(b.status)) return NextResponse.json({ error: 'Invalid attendance details.' }, { status: 400 });
      await queryNeon(
        `INSERT INTO attendance(student_id,attendance_date,status,recorded_by)
         VALUES($1,$2,$3,$4)
         ON CONFLICT(student_id,attendance_date) DO UPDATE SET status=EXCLUDED.status,recorded_by=EXCLUDED.recorded_by`,
        [b.studentId, b.date, b.status, s.userId]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown record type.' }, { status: 400 });
  } catch (e) {
    const message = String(e).includes('duplicate') ? 'Student ID already exists.' : 'Unable to save record.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
