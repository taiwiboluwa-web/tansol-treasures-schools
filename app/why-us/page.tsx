const values=['Respect','Tolerance','Discipline','Excellence','Empowerment','Confidence','Integrity','Innovation'];

export default function WhyUsPage(){
  return <main className="page-shell py-20">
    <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
      <div>
        <p className="eyebrow text-[var(--gold)]">Why Tansol</p>
        <h1 className="display mt-4 text-6xl leading-none md:text-7xl">A school experience with substance.</h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">Our values shape the way we teach, learn, relate to one another and prepare pupils for the responsibilities and opportunities ahead.</p>
      </div>
      <section className="border-y border-[var(--line)]">
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
          {values.map((value,i)=><div key={value} className="bg-[var(--surface)] p-7 md:p-8"><span className="font-mono text-sm text-[var(--gold)]">0{i+1}</span><h2 className="display mt-3 text-3xl">{value}</h2><p className="mt-3 leading-7 text-[var(--muted)]">A principle we intentionally cultivate in every part of school life.</p></div>)}
        </div>
      </section>
    </div>
  </main>;
}
