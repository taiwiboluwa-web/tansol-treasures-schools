import Link from 'next/link';

const values = ['Respect', 'Tolerance', 'Discipline', 'Excellence', 'Empowerment', 'Confidence', 'Integrity', 'Innovation'];
const doodles = ['✦', '●', '＋', '◆'];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="hero-wrap relative">
        <div className="pointer-events-none absolute left-[6%] top-24 text-3xl text-[var(--sun)]">✦</div>
        <div className="pointer-events-none absolute right-[7%] top-36 text-2xl text-[var(--brand)]/25">●</div>
        <div className="page-shell relative grid min-h-[720px] items-center gap-12 py-14 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="eyebrow rounded-full bg-[var(--sun)] px-4 py-2 text-[var(--brand-dark)] shadow-sm">Established 2009</span>
              <span className="eyebrow rounded-full bg-white px-4 py-2 text-[var(--brand)] shadow-sm">Learning • Character • Fun</span>
            </div>
            <h1 className="display text-[clamp(3.7rem,8vw,7.8rem)] leading-[.84] text-[var(--ink)]">
              Big <em className="not-italic text-[var(--brand)]">dreams.</em>
              <br />Bright futures.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
              Tansol Treasure School is a happy place to learn, make friends, build confidence and discover the amazing things every child can become.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="https://wa.me/2348023201622?text=Hello%20Tansol%20Treasure%20School%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noreferrer" className="cta-primary rounded-full px-7 py-3.5 font-bold !text-white transition hover:-translate-y-0.5">Talk to our school ↗</a>
              <Link href="/admission" className="rounded-full border-2 border-[var(--brand)] bg-white px-7 py-3.5 font-bold text-[var(--brand)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-soft)]">Explore admission</Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['01', 'Learn', 'Curious minds'],
                ['02', 'Grow', 'Kind hearts'],
                ['03', 'Lead', 'Brave voices'],
              ].map(([number, title, caption], i) => (
                <div key={number} className={`rounded-[1.5rem] p-4 ${i === 0 ? 'bg-[var(--sky)]' : i === 1 ? 'bg-[var(--mint)]' : 'bg-[var(--coral)]'}`}>
                  <strong className="text-xs text-[var(--brand)]">{number}</strong>
                  <p className="mt-2 text-lg font-black">{title}</p>
                  <p className="text-xs text-[var(--muted)]">{caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-art relative mx-auto h-[520px] w-full max-w-[620px] lg:h-[610px]">
            <div className="absolute inset-x-8 top-5 h-[78%] rotate-[-3deg] rounded-[3rem] bg-[var(--brand)] shadow-2xl" />
            <div className="absolute inset-x-0 top-0 h-[78%] overflow-hidden rounded-[3rem] border-[10px] border-white bg-[linear-gradient(145deg,#dff4ff_0%,#fff4bd_52%,#f7d5ce_100%)] shadow-2xl">
              <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/60" />
              <div className="absolute -bottom-24 -left-16 size-80 rounded-full bg-[var(--brand)]/10" />
              <div className="absolute left-7 top-7 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[var(--brand)]">Tansol Treasure School</div>
              <div className="absolute left-10 top-24 grid size-20 rotate-[-8deg] place-items-center rounded-[1.5rem] bg-[var(--sun)] text-3xl shadow-lg">★</div>
              <div className="absolute right-10 top-36 grid size-16 rotate-[9deg] place-items-center rounded-full bg-[var(--mint)] text-2xl text-[var(--brand)] shadow-lg">✦</div>
              <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] bg-white/95 p-7 backdrop-blur-sm">
                <p className="eyebrow text-[var(--gold)]">Our promise</p>
                <p className="display mt-2 text-4xl leading-none text-[var(--brand)]">Every child is seen, encouraged &amp; ready to shine.</p>
              </div>
            </div>
            <div className="absolute -bottom-2 right-0 z-10 max-w-[230px] rotate-[3deg] rounded-[1.75rem] bg-white p-5 shadow-xl">
              <p className="eyebrow text-[var(--brand)]">At Tansol</p>
              <p className="mt-2 text-sm font-semibold leading-6">We grow creative, responsible and confident future leaders.</p>
            </div>
            <div className="absolute bottom-20 left-0 z-10 grid size-24 rotate-[-5deg] place-items-center rounded-[2rem] bg-[var(--sun)] text-center text-sm font-black text-[var(--brand-dark)] shadow-lg">Learn<br />Grow<br />Lead</div>
          </div>
        </div>
      </section>

      <div className="brand-ticker border-y border-[var(--brand)]/10 bg-[var(--brand)] py-4 text-white">
        <div className="ticker-track flex w-max gap-12 whitespace-nowrap text-sm font-black uppercase tracking-[.18em]">
          <span>Curious minds</span><span>•</span><span>Kind hearts</span><span>•</span><span>Creative confidence</span><span>•</span><span>Happy learning</span><span>•</span><span>Curious minds</span><span>•</span><span>Kind hearts</span><span>•</span>
        </div>
      </div>

      <section className="page-shell py-24">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="eyebrow text-[var(--gold)]">Why Tansol</p>
            <h2 className="display mt-4 text-5xl leading-[.92] md:text-7xl">A school where the whole child matters.</h2>
            <p className="mt-6 max-w-md leading-7 text-[var(--muted)]">Education should feel exciting and meaningful. We build knowledge, confidence, character, creativity and practical ability side by side.</p>
            <Link href="/why-us" className="mt-7 inline-flex font-bold text-[var(--brand)] underline decoration-[var(--sun)] decoration-4 underline-offset-8">See what makes Tansol special →</Link>
          </div>
          <div className="value-grid grid grid-cols-2 gap-3 md:grid-cols-4">
            {values.map((value, i) => (
              <div key={value} className={`value-tile group relative min-h-[150px] overflow-hidden rounded-[1.75rem] p-5 ${i % 4 === 0 ? 'bg-[var(--brand)] text-white' : i % 4 === 1 ? 'bg-[var(--sun)]' : i % 4 === 2 ? 'bg-[var(--sky)]' : 'bg-[var(--mint)]'}`}>
                <span className="text-sm font-black opacity-50">0{i + 1}</span>
                <span className="absolute right-4 top-4 text-2xl opacity-70">{doodles[i % doodles.length]}</span>
                <p className="absolute bottom-5 left-5 text-xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff0df] py-24">
        <div className="page-shell grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-[var(--gold)]">From the Proprietress&apos; Desk</p>
            <h2 className="display mt-4 max-w-4xl text-5xl leading-[.9] md:text-7xl">“Preparing children to confidently meet the challenges of life.”</h2>
          </div>
          <Link href="/about/proprietress" className="rounded-full bg-[var(--brand)] px-6 py-3 font-bold !text-white transition hover:bg-[var(--brand-dark)]">Read her message →</Link>
        </div>
      </section>

      <section className="page-shell py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[2.5rem] bg-[var(--brand)] p-8 text-white md:p-12">
            <p className="eyebrow text-[var(--sun)]">Admissions</p>
            <h2 className="display mt-5 max-w-2xl text-5xl leading-[.9] md:text-7xl">Give your child room to learn, grow and lead.</h2>
            <p className="mt-7 max-w-xl leading-7 text-white/80">Come and discover a welcoming school community where children are encouraged to ask questions, try new things and become confident in who they are.</p>
            <a href="https://wa.me/2348023201622?text=Hello%20Tansol%20Treasure%20School%2C%20I%20would%20like%20to%20make%20an%20enquiry%20about%20admission." target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-bold !text-[var(--brand)] transition hover:-translate-y-0.5">Chat on WhatsApp ↗</a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/curriculum" className="group rounded-[2rem] border border-[var(--line)] bg-[var(--sky)] p-7 transition hover:-translate-y-1 hover:border-[var(--brand)]"><span className="eyebrow text-[var(--brand)]">01 / Curriculum</span><h3 className="display mt-3 text-3xl">Learning that connects classroom ideas to real life.</h3><span className="mt-7 block font-bold text-[var(--brand)]">Explore curriculum →</span></Link>
            <Link href="/gallery" className="group rounded-[2rem] border border-[var(--line)] bg-[var(--mint)] p-7 transition hover:-translate-y-1 hover:border-[var(--brand)]"><span className="eyebrow text-[var(--brand)]">02 / School life</span><h3 className="display mt-3 text-3xl">See the smiles, moments and memories behind the learning.</h3><span className="mt-7 block font-bold text-[var(--brand)]">View gallery →</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
