import Link from 'next/link';

export default function Home() {
  return <main>
    <section className="page-shell grid min-h-[72vh] items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        <p className="eyebrow text-[var(--gold)]">Learning with purpose</p>
        <h1 className="display mt-5 max-w-3xl text-6xl leading-[.94] md:text-8xl">Where every child is seen, challenged and prepared.</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">Tansol Treasure School brings strong academics, practical confidence and character development into one thoughtful learning experience.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/admission" className="rounded-full bg-[var(--green)] px-6 py-3 font-bold text-white">Explore admission</Link><Link href="/portal" className="rounded-full border border-[var(--line)] bg-white px-6 py-3 font-bold">Enter school portal</Link></div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[var(--green)] p-8 text-white">
        <div className="absolute -right-20 -top-20 size-64 rounded-full border border-white/20" />
        <div className="absolute bottom-8 left-8 right-8 grid grid-cols-[1fr_auto] items-end gap-6 border-t border-white/20 pt-6"><div><p className="eyebrow text-white/60">Our promise</p><p className="display mt-2 text-3xl">Strong roots. Wider horizons.</p></div><span className="text-5xl font-light text-[var(--gold)]">01</span></div>
      </div>
    </section>
    <section className="border-y border-[var(--line)] bg-[var(--surface)]"><div className="page-shell grid gap-10 py-14 md:grid-cols-3"><div><p className="eyebrow">01 / Academics</p><h2 className="display mt-3 text-3xl">Serious about understanding.</h2></div><div><p className="eyebrow">02 / Character</p><h2 className="display mt-3 text-3xl">Confidence with responsibility.</h2></div><div><p className="eyebrow">03 / Future</p><h2 className="display mt-3 text-3xl">Skills beyond the classroom.</h2></div></div></section>
  </main>;
}
