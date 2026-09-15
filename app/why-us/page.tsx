'use client';

import { useState } from 'react';

const values = [
  { name: 'Respect', text: 'We teach pupils to value themselves and others, listen with care, and treat every person with dignity.' },
  { name: 'Tolerance', text: 'We encourage pupils to understand differences, show patience, and create room for others to learn and grow.' },
  { name: 'Discipline', text: 'We build self-control, responsibility, consistency, and positive habits that help pupils make good choices.' },
  { name: 'Excellence', text: 'We encourage pupils to pursue high standards, take ownership of their work, and keep improving.' },
  { name: 'Empowerment', text: 'We give pupils the knowledge, skills, confidence, and opportunities to take initiative and make meaningful contributions.' },
  { name: 'Confidence', text: 'We help pupils believe in their abilities, express themselves positively, and approach challenges with courage.' },
  { name: 'Integrity', text: 'We nurture honesty, accountability, and the courage to do what is right, even when no one is watching.' },
  { name: 'Innovation', text: 'We encourage curiosity, creativity, problem-solving, and the confidence to explore better ways of doing things.' },
];

export default function WhyUsPage() {
  const [openValue, setOpenValue] = useState<string | null>(null);

  return <main className="page-shell py-20">
    <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
      <div>
        <p className="eyebrow text-[var(--gold)]">Why Tansol</p>
        <h1 className="display mt-4 text-6xl leading-none md:text-7xl">A school experience with substance.</h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">Our values shape the way we teach, learn, relate to one another and prepare pupils for the responsibilities and opportunities ahead.</p>
      </div>

      <section className="border-y border-[var(--line)]" aria-label="Tansol Treasure School core values">
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
          {values.map((value, i) => {
            const isOpen = openValue === value.name;

            return <article key={value.name} className="bg-[var(--surface)]">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`value-${i + 1}`}
                onClick={() => setOpenValue(isOpen ? null : value.name)}
                className="group flex w-full items-start justify-between gap-6 p-7 text-left transition hover:bg-[var(--brand-soft)] md:p-8"
              >
                <span>
                  <span className="font-mono text-sm text-[var(--gold)]">0{i + 1}</span>
                  <span className="display mt-3 block text-3xl">{value.name}</span>
                </span>
                <span className={`mt-1 text-lg text-[var(--brand)] transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} aria-hidden="true">↗</span>
              </button>

              <div
                id={`value-${i + 1}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-[var(--line)] px-7 pb-7 pt-5 leading-7 text-[var(--muted)] md:px-8 md:pb-8">
                    {value.text}
                  </p>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>
    </div>
  </main>;
}
