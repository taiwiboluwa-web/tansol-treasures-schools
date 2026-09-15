import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tansol Treasure School',
  description: 'A thoughtful learning community preparing children to learn, lead and flourish.',
};

const links = [
  ['About', '/about'], ['Why Us', '/why-us'], ['Curriculum', '/curriculum'],
  ['Admission', '/admission'], ['Gallery', '/gallery'], ['Blog', '/blog'], ['Contact', '/contact'],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="page-shell flex min-h-20 items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-3" aria-label="Tansol Treasure School home">
              <span className="grid size-10 place-items-center rounded-full bg-[var(--green)] text-sm font-bold text-white">T</span>
              <span><span className="block text-sm font-bold tracking-[.12em]">TANSOL TREASURE</span><span className="block text-[10px] uppercase tracking-[.24em] text-[var(--muted)]">School</span></span>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
              {links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-[var(--muted)] transition hover:text-[var(--green)]">{label}</Link>)}
            </nav>
            <Link href="/portal" className="rounded-full bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#103b2d]">School Portal</Link>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.3fr_.8fr_1fr]">
            <div><p className="eyebrow text-[var(--gold)]">Tansol Treasure School</p><h2 className="display mt-3 max-w-md text-3xl">A school built around curiosity, character and capability.</h2></div>
            <div><p className="eyebrow text-[var(--muted)]">Explore</p><div className="mt-4 grid gap-2 text-sm text-[var(--muted)]"><Link href="/about">About</Link><Link href="/curriculum">Curriculum</Link><Link href="/admission">Admission</Link><Link href="/portal">Portal</Link></div></div>
            <div><p className="eyebrow text-[var(--muted)]">Connect</p><div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--muted)]"><Link href="tel:+2348023201622" className="hover:text-[var(--green)]">+234 802 320 1622</Link><Link href="mailto:info@tansolschool.com.ng" className="break-all hover:text-[var(--green)]">info@tansolschool.com.ng</Link><Link href="/contact" className="mt-2 font-bold text-[var(--green)]">Contact the school →</Link></div></div>
          </div>
          <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} Tansol Treasure School. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
