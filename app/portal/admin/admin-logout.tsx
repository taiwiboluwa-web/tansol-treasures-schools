'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogout(){
  const router=useRouter();
  const [loading,setLoading]=useState(false);
  async function logout(){
    setLoading(true);
    try{
      const response=await fetch('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store'});
      if(!response.ok) throw new Error('Logout failed');
      router.replace('/portal/admin');
      router.refresh();
    }catch{
      setLoading(false);
    }
  }
  return <button type="button" onClick={logout} disabled={loading} aria-label="Log out of administrator portal" className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--brand)] transition hover:border-[var(--brand)] disabled:opacity-60">{loading?'Signing out…':'Log out'}</button>
}
