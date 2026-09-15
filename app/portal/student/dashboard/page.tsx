import { requireRole } from '@/lib/auth/server';
import { getCurrentAcademicPeriod, getPublishedStudentResults, getStudentIdentity, getStudentResultHistory } from '@/lib/db/results';
import { PrintButton } from './print-button';
import { queryNeon } from '@/lib/db/client';

function ResultTable({ rows, empty = 'No published results are available for this term yet.' }: { rows: Awaited<ReturnType<typeof getPublishedStudentResults>>; empty?: string }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead className="bg-[#ebe8de]"><tr>{['Subject','CA / 40','Exam / 60','Total','Grade','Remark'].map(h=><th key={h} className="px-5 py-4 font-bold">{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map(r=><tr key={`${r.session || ''}-${r.term || ''}-${r.subject}`} className="border-t border-[var(--line)]"><td className="px-5 py-4 font-semibold">{r.subject}</td><td className="px-5 py-4">{Number(r.ca_score).toFixed(1)}</td><td className="px-5 py-4">{Number(r.exam_score).toFixed(1)}</td><td className="px-5 py-4 font-bold">{Number(r.total_score).toFixed(1)}</td><td className="px-5 py-4">{r.grade}</td><td className="px-5 py-4 text-[var(--muted)]">{r.remark || '—'}</td></tr>) : <tr><td colSpan={6} className="px-5 py-16 text-center text-[var(--muted)]">{empty}</td></tr>}</tbody></table></div>;
}

export default async function StudentDashboard() {
  const session = await requireRole(['student']);
  const student = await getStudentIdentity(session.userId);
  if (!student) return <main className="page-shell py-20"><p className="eyebrow text-red-700">Account setup</p><h1 className="display mt-3 text-5xl">Student profile not linked.</h1></main>;

  const current = await getCurrentAcademicPeriod(student.student_id);
  const [currentRows, history, overview, bills] = await Promise.all([
    getPublishedStudentResults(student.student_id, current.session, current.term),
    getStudentResultHistory(student.student_id),
    queryNeon<{ status: string; attendance_date: string }>(`SELECT status,attendance_date FROM attendance WHERE student_id=$1 ORDER BY attendance_date DESC LIMIT 12`, [student.id]),
    queryNeon<{ description: string; amount: string; amount_paid: string; due_date: string | null }>(`SELECT description,amount,amount_paid,due_date FROM billing_items WHERE student_id=$1 ORDER BY created_at DESC`, [student.id])
  ]);

  const totalBilled = bills.reduce((n, b) => n + Number(b.amount), 0);
  const paid = bills.reduce((n, b) => n + Number(b.amount_paid), 0);
  const average = currentRows.length ? currentRows.reduce((sum, r) => sum + Number(r.total_score), 0) / currentRows.length : 0;
  const pastGroups = history.reduce<Record<string, typeof history>>((groups, row) => {
    const key = `${row.session} · ${row.term}`;
    if (key !== `${current.session} · ${current.term}`) (groups[key] ||= []).push(row);
    return groups;
  }, {});

  return <main className="page-shell py-16">
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line)] pb-8"><div><p className="eyebrow text-[var(--gold)]">Student dashboard</p><h1 className="display mt-3 text-5xl md:text-6xl">Welcome, {student.full_name}.</h1><p className="mt-3 text-[var(--muted)]">{student.student_id} · {student.class_name}</p></div><div className="text-right"><p className="eyebrow">Current assessment · {current.term} · {current.session}</p><p className="display mt-2 text-4xl">{average.toFixed(1)}%</p></div></div>

    <section className="mt-10 grid gap-4 md:grid-cols-3"><div className="rounded-3xl border border-[var(--line)] bg-[var(--brand-soft)] p-6"><p className="eyebrow">Attendance</p><p className="display mt-5 text-4xl">{overview.filter(x=>x.status==='present').length}/{overview.length||0}</p><p className="mt-2 text-sm text-[var(--muted)]">Present in recent records</p></div><div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><p className="eyebrow">Fees billed</p><p className="display mt-5 text-4xl">₦{totalBilled.toLocaleString()}</p></div><div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><p className="eyebrow">Outstanding</p><p className="display mt-5 text-4xl">₦{Math.max(0,totalBilled-paid).toLocaleString()}</p></div></section>

    <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-[var(--gold)]">Current assessment</p><h2 className="display mt-2 text-4xl">{current.term}</h2><p className="mt-2 text-sm text-[var(--muted)]">{current.session} · Officially published results</p></div>{currentRows.length>0&&<p className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-sm font-bold text-[var(--brand)]">{currentRows.length} subjects</p>}</div><div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)]"><ResultTable rows={currentRows}/></div></section>

    <section className="mt-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-[var(--gold)]">Academic history</p><h2 className="display mt-2 text-4xl">Past assessments & results</h2><p className="mt-2 text-sm text-[var(--muted)]">Every published assessment attached to your school account.</p></div></div><div className="mt-6 space-y-6">{Object.entries(pastGroups).length ? Object.entries(pastGroups).map(([period, rows])=><details key={period} className="group overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><summary className="cursor-pointer list-none px-6 py-5"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Past assessment</p><h3 className="display mt-1 text-2xl">{period}</h3></div><span className="text-sm font-bold text-[var(--brand)]">{rows.length} subjects · View</span></div></summary><div className="border-t border-[var(--line)]"><ResultTable rows={rows}/></div></details>) : <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-sm text-[var(--muted)]">No past published assessments are available yet.</div>}</div></section>

    <section className="mt-10 grid gap-8 md:grid-cols-2"><div><p className="eyebrow">Recent attendance</p><div className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">{overview.length?overview.map(x=><div key={x.attendance_date} className="flex justify-between py-3"><span>{x.attendance_date}</span><strong className="capitalize">{x.status}</strong></div>):<p className="py-6 text-[var(--muted)]">No attendance recorded yet.</p>}</div></div><div><p className="eyebrow">Billing</p><div className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">{bills.length?bills.map((b,i)=><div key={i} className="py-3"><div className="flex justify-between gap-4"><strong>{b.description}</strong><span>₦{Number(b.amount).toLocaleString()}</span></div><p className="mt-1 text-sm text-[var(--muted)]">Paid ₦{Number(b.amount_paid).toLocaleString()} · Balance ₦{Math.max(0,Number(b.amount)-Number(b.amount_paid)).toLocaleString()}</p></div>):<p className="py-6 text-[var(--muted)]">No billing records yet.</p>}</div></div></section>
    <PrintButton />
  </main>;
}
