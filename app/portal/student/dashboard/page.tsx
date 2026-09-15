import { requireRole } from '@/lib/auth/server';
import { getPublishedStudentResults, getStudentIdentity } from '@/lib/db/results';
import { PrintButton } from './print-button';

export default async function StudentDashboard(){
  const session=await requireRole(['student']);
  const student=await getStudentIdentity(session.userId);
  if(!student)return <main className="page-shell py-20"><p className="eyebrow text-red-700">Account setup</p><h1 className="display mt-3 text-5xl">Student profile not linked.</h1></main>;
  const rows=await getPublishedStudentResults(student.student_id,'2025/2026','First Term');
  const average=rows.length?rows.reduce((sum,r)=>sum+Number(r.total_score),0)/rows.length:0;
  return <main className="page-shell py-16"><div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line)] pb-8"><div><p className="eyebrow text-[var(--gold)]">Student dashboard</p><h1 className="display mt-3 text-5xl md:text-6xl">Welcome, {session.fullName}.</h1><p className="mt-3 text-[var(--muted)]">{student.student_id} · {student.class_name}</p></div><div className="text-right"><p className="eyebrow">First term · 2025/2026</p><p className="display mt-2 text-4xl">{average.toFixed(1)}%</p></div></div><section className="mt-10 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]"><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead className="bg-[#ebe8de]"><tr>{['Subject','CA / 40','Exam / 60','Total','Grade','Remark'].map(h=><th key={h} className="px-5 py-4 font-bold">{h}</th>)}</tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.subject} className="border-t border-[var(--line)]"><td className="px-5 py-4 font-semibold">{r.subject}</td><td className="px-5 py-4">{Number(r.ca_score).toFixed(1)}</td><td className="px-5 py-4">{Number(r.exam_score).toFixed(1)}</td><td className="px-5 py-4 font-bold">{Number(r.total_score).toFixed(1)}</td><td className="px-5 py-4">{r.grade}</td><td className="px-5 py-4 text-[var(--muted)]">{r.remark||'—'}</td></tr>):<tr><td colSpan={6} className="px-5 py-16 text-center text-[var(--muted)]">No published results are available for this term yet.</td></tr>}</tbody></table></div></section><PrintButton /></main>;
}
