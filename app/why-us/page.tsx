import type { ReactNode } from 'react';

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

function ValueCard({ value, index }: { value: (typeof values)[number]; index: number }): ReactNode {
  return (
    <details className="group bg-[var(--surface)]">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-7 text-left transition hover:bg-[var(--brand-soft)] md:p-8 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-mono text-sm text-[var(--gold)]">0{index + 1}</span>
          <span className="display mt-3 block text-3xl">{value.name}</span>
        </span>
        <span className="mt-1 text-lg text-[var(--brand)] transition-transform duration-300 group-open:rotate-90" aria-hidden="true">↗</span>
      </summary>
      <div className="border-t border-[var(--line)] px-7 pb-7 pt-5 md:px-8 md:pb-8">
        <p className="leading-7 text-[var(--muted)]">{value.text}</p>
      </div>
    </details>
  );
}

export default function WhyUsPage() {
  return (
    <main className="page-shell py-20">
      <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="eyebrow text-[var(--gold)]">Why Tansol</p>
          <h1 className="display mt-4 text-6xl leading-none md:text-7xl">A school experience with substance.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">Our values shape the way we teach, learn, relate to one another and prepare pupils for the responsibilities and opportunities ahead.</p>
        </div>

        <section className="border-y border-[var(--line)]" aria-label="Tansol Treasure School core values">
          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
            {values.map((value, index) => <ValueCard key={value.name} value={value} index={index} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
