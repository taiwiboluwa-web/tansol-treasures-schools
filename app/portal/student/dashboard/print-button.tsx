'use client';
export function PrintButton(){return <button type="button" onClick={()=>window.print()} className="mt-6 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-bold print:hidden">Print result sheet</button>}
