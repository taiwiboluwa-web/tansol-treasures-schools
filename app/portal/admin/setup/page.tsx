'use client';

import { FormEvent, useState } from 'react';

export default function AdminSetupPage() {
  const [setupToken, setSetupToken] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const response = await fetch('/api/auth/admin-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupToken, email, fullName, password }),
    });
    const data = await response.json();

    if (!response.ok) setError(data.error ?? 'Unable to create administrator.');
    else setMessage(data.message);
    setLoading(false);
  }

  return (
    <main className="page-shell grid min-h-[75vh] items-center gap-12 py-16 lg:grid-cols-[1fr_.7fr]">
      <div>
        <p className="eyebrow text-[var(--gold)]">Administrator setup</p>
        <h1 className="display mt-4 text-6xl leading-none md:text-8xl">Create the school administrator.</h1>
        <p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">
          Use this secure setup page to create or reset an administrator account. The password is hashed before it is stored in Neon.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 md:p-9">
        <label className="block">
          <span className="eyebrow">Setup token</span>
          <input type="password" value={setupToken} onChange={(e) => setSetupToken(e.target.value)} required className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]" autoComplete="off" />
        </label>
        <label className="mt-7 block">
          <span className="eyebrow">Administrator name</span>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]" autoComplete="name" />
        </label>
        <label className="mt-7 block">
          <span className="eyebrow">Admin email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]" autoComplete="email" />
        </label>
        <label className="mt-7 block">
          <span className="eyebrow">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={10} required className="mt-2 w-full border-b border-[var(--line)] bg-transparent py-3 outline-none focus:border-[var(--brand)]" autoComplete="new-password" />
          <span className="mt-2 block text-xs text-[var(--muted)]">At least 10 characters.</span>
        </label>
        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="mt-5 text-sm text-[var(--brand)]">{message}</p>}
        <button disabled={loading} className="mt-8 w-full rounded-full bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Creating administrator…' : 'Create administrator'}
        </button>
      </form>
    </main>
  );
}
