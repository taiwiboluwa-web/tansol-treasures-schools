import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/server';
import { queryNeon } from '@/lib/db/client';

async function requireAdmin() {
  const session = await getSession();
  return session?.role === 'admin' ? session : null;
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const studentId = url.searchParams.get('studentId');
  if (!studentId) return NextResponse.json({ error: 'Pupil is required.' }, { status: 400 });
  const student = await queryNeon(`SELECT s.id,s.student_id,s.class_name,u.full_name,u.email FROM students s JOIN users u ON u.id=s.user_id WHERE s.id=$1`, [studentId]);
  if (!student.length) return NextResponse.json({ error: 'Pupil not found.' }, { status: 404 });
  const results = await queryNeon(`SELECT id,student_id,session,term,subject,ca_score,exam_score,total_score,grade,remark,is_published,updated_at FROM results WHERE student_id=$1 ORDER BY session DESC,term,subject`, [student[0].student_id]);
  const attendance = await queryNeon(`SELECT id,attendance_date,status,recorded_by FROM attendance WHERE student_id=$1 ORDER BY attendance_date DESC`, [studentId]);
  const billing = await queryNeon(`SELECT id,session,term,description,amount,amount_paid,(amount-amount_paid) AS balance,due_date,created_at FROM billing_items WHERE student_id=$1 ORDER BY created_at DESC`, [studentId]);
  return NextResponse.json({ student: student[0], results, attendance, billing });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (body.type === 'result') {
      const resultId = String(body.id || '');
      const ca = Number(body.ca);
      const exam = Number(body.exam);
      if (!resultId || ca < 0 || ca > 40 || exam < 0 || exam > 60) return NextResponse.json({ error: 'Invalid result details.' }, { status: 400 });
      const old = await queryNeon(`SELECT ca_score,exam_score FROM results WHERE id=$1`, [resultId]);
      if (!old.length) return NextResponse.json({ error: 'Result not found.' }, { status: 404 });
      const total = ca + exam;
      const grade = total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : total >= 40 ? 'D' : 'F';
      await queryNeon(`UPDATE results SET ca_score=$1,exam_score=$2,grade=$3,remark=$4,updated_at=CURRENT_TIMESTAMP WHERE id=$5`, [ca, exam, grade, body.remark || null, resultId]);
      await queryNeon(`INSERT INTO result_audit_logs(result_id,changed_by,action,old_ca_score,old_exam_score,new_ca_score,new_exam_score) VALUES($1,$2,'updated',$3,$4,$5,$6)`, [resultId, session.userId, old[0].ca_score, old[0].exam_score, ca, exam]);
      return NextResponse.json({ ok: true, total, grade });
    }
    if (body.type === 'publish') {
      const id = String(body.id || '');
      if (!id) return NextResponse.json({ error: 'Result is required.' }, { status: 400 });
      await queryNeon(`UPDATE results SET is_published=$1,updated_at=CURRENT_TIMESTAMP WHERE id=$2`, [Boolean(body.published), id]);
      return NextResponse.json({ ok: true });
    }
    if (body.type === 'attendance') {
      const id = String(body.id || '');
      if (!id || !['present','absent','late'].includes(body.status)) return NextResponse.json({ error: 'Invalid attendance details.' }, { status: 400 });
      await queryNeon(`UPDATE attendance SET attendance_date=$1,status=$2,recorded_by=$3 WHERE id=$4`, [body.date, body.status, session.userId, id]);
      return NextResponse.json({ ok: true });
    }
    if (body.type === 'billing') {
      const id = String(body.id || '');
      const amount = Number(body.amount);
      const amountPaid = Number(body.amountPaid);
      if (!id || amount < 0 || amountPaid < 0 || amountPaid > amount || !body.session || !body.term || !body.description) return NextResponse.json({ error: 'Invalid billing details.' }, { status: 400 });
      await queryNeon(`UPDATE billing_items SET session=$1,term=$2,description=$3,amount=$4,amount_paid=$5,due_date=$6 WHERE id=$7`, [body.session, body.term, body.description, amount, amountPaid, body.dueDate || null, id]);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Unknown record type.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Unable to update record.' }, { status: 500 });
  }
}
