import { getSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import AdminLogin from './admin-login';
import AdminOperations from './admin-operations';
import AdminLogout from './admin-logout';

export default async function AdminPage(){
  const s=await getSession();
  if(!s)return <AdminLogin/>;
  if(s.role!=='admin')redirect('/portal');
  return <main className="page-shell py-20">
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="eyebrow text-[var(--gold)]">Administration</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">School operations, under control.</h1>
        <p className="mt-6 max-w-2xl leading-7 text-[var(--muted)]">Welcome {s.fullName}. Full administrator access includes pupil, staff, results, attendance and billing management.</p>
      </div>
      <AdminLogout />
    </div>
    <div className="mt-12 grid gap-4 md:grid-cols-4">{['Pupils','Staff','Results','Attendance & billing'].map((x,i)=><div key={x} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"><span className="font-mono text-xs text-[var(--gold)]">0{i+1}</span><h2 className="display mt-12 text-3xl">{x}</h2><p className="mt-3 text-sm text-[var(--muted)]">{i===0?'Create and link pupil login credentials.':i===1?'Create, edit and reset staff/teacher accounts.':i===2?'View, edit and publish academic results.':'Edit attendance and prepare or update school fees.'}</p></div>)}</div>
    <AdminOperations/>
  </main>
}
