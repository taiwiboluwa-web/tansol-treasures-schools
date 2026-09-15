'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = { id: string; student_id: string; full_name: string; class_name: string };

export default function StaffWorkspace({ fullName, role }: { fullName: string; role: string }) {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState({ session: '2025/2026', term: 'First Term', subject: '', ca: '', exam: '', remark: '' });
  const [attendance, setAttendance] = useState({ date: new Date().toISOString().slice(0, 10), status: 'present' });

  useEffect(() => {
    fetch('/api/staff/records', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setStudents(data.students || []))
      .catch(() => setMessage('Could not load pupils.'))
      .finally(() => setLoading(false));
  }, []);

  async function save(type: 'result' | 'attendance', e: FormEvent) {
    e.preventDefault();
    if (!studentId) { setMessage('Select a pupil first.'); return; }
    setSaving(true); setMessage('');
    const body = type === 'result'
      ? { type, studentId, session: result.session, term: result.term, subject: result.subject, ca: result.ca, exam: result.exam, remark: result.remark }
      : { type, studentId, date: attendance.date, status: attendance.status };
    try {
      const response = await fetch('/api/staff/records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      setMessage(response.ok ? (type === 'result' ? `Result saved. Total: ${data.total}/100 · Grade: ${data.grade}` : 'Attendance saved.') : data.error || 'Could not save record.');
    } catch { setMessage('Could not save record.'); }
    finally { setSaving(false); }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/portal/staff');
    router.refresh();
  }

  return (
    <main className="page-shell py-16 md:py-20">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="eyebrow text-[var(--gold)]">Staff portal</p>
          <h1 className="display mt-4 text-6xl leading-none md:text-8xl">Teaching, organised.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">Welcome {fullName}. Enter academic results and attendance without accessing administrative controls.</p>
        </div>
        <button type="button" onClick={logout} className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--brand)]">Log out</button>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7">
          <p className="eyebrow">Pupil</p>
          <h2 className="display mt-3 text-4xl">Choose a pupil</h2>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} disabled={loading} className="mt-7 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]">
            <option value="">{loading ? 'Loading pupils…' : 'Select pupil'}</option>
            {students.map((student) => <option key={student.id} value={student.id}>{student.full_name} · {student.student_id} · {student.class_name}</option>)}
          </select>
          {role === 'admin' && <p className="mt-6 text-sm text-[var(--muted)]">You are signed in as an administrator. Full administrative tools remain available at the admin portal.</p>}
        </aside>

        <div className="space-y-6">
          <form onSubmit={(e) => save('result', e)} className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7">
            <p className="eyebrow text-[var(--gold)]">01 · Results</p>
            <h2 className="display mt-3 text-4xl">Enter or update a result</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input value={result.session} onChange={(e) => setResult({ ...result, session: e.target.value })} placeholder="Academic session" required className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
              <input value={result.term} onChange={(e) => setResult({ ...result, term: e.target.value })} placeholder="Term" required className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
              <input value={result.subject} onChange={(e) => setResult({ ...result, subject: e.target.value })} placeholder="Subject" required className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
              <input value={result.ca} onChange={(e) => setResult({ ...result, ca: e.target.value })} type="number" min="0" max="40" step=".01" placeholder="CA / 40" required className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
              <input value={result.exam} onChange={(e) => setResult({ ...result, exam: e.target.value })} type="number" min="0" max="60" step=".01" placeholder="Exam / 60" required className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
              <input value={result.remark} onChange={(e) => setResult({ ...result, remark: e.target.value })} placeholder="Remark (optional)" className="border-b border-[var(--line)] bg-transparent py-3 outline-none" />
            </div>
            <button disabled={saving} className="mt-6 rounded-full bg-[var(--brand)] px-6 py-3 font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save result'}</button>
          </form>

          <form onSubmit={(e) => save('attendance', e)} className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7">
            <p className="eyebrow text-[var(--gold)]">02 · Attendance</p>
            <h2 className="display mt-3 text-4xl">Record attendance</h2>
            <div className="mt-6 flex flex-wrap gap-5 items-end">
              <label className="flex-1 min-w-48"><span className="eyebrow">Date</span><input type="date" value={attendance.date} onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} required className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3" /></label>
              <label className="flex-1 min-w-48"><span className="eyebrow">Status</span><select value={attendance.status} onChange={(e) => setAttendance({ ...attendance, status: e.target.value })} className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></label>
              <button disabled={saving} className="rounded-full bg-[var(--brand)] px-6 py-3 font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save attendance'}</button>
            </div>
          </form>
        </div>
      </section>
      {message && <p role="status" className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--brand-soft)] p-4 text-sm font-semibold text-[var(--brand)]">{message}</p>}
    </main>
  );
}
