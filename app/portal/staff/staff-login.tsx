'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok || !['staff', 'admin'].includes(data.role)) {
        setError(response.ok ? 'This account does not have staff access.' : data.error || 'Unable to sign in.');
        setLoading(false);
        return;
      }
      router.replace('/portal/staff');
      router.refresh();
    } catch {
      setError('Unable to sign in right now. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="page-shell grid min-h-[75vh] items-center gap-12 py-16 lg:grid-cols-[1fr_.7fr]">
      <div>
        <p className="eyebrow text-[var(--gold)]">Staff & teacher access</p>
        <h1 className="display mt-4 text-6xl leading-none md:text-8xl">Your teaching workspace.</h1>
        <p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">Sign in to enter results and attendance for pupils. Administrators can also use this portal with their existing admin account.</p>
      </div>
      <form onSubmit={submit} className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9">
        <label className="block">
          <span className="eyebrow">Staff ID or email</span>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required autoComplete="username" className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]" />
        </label>
        <label className="mt-7 block">
          <span className="eyebrow">Password</span>
          <span className="mt-2 flex border-b border-[var(--line)]">
            <input value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" type={showPassword ? 'text' : 'password'} className="w-full bg-transparent py-3 outline-none focus:border-[var(--brand)]" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="px-2 text-sm font-bold text-[var(--brand)]">{showPassword ? 'Hide' : 'Show'}</button>
          </span>
        </label>
        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-8 w-full rounded-full bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in to staff portal'}</button>
      </form>
    </main>
  );
}
