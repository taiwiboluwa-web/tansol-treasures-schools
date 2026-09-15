import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tansol Treasure School',
  description: 'Quality education, holistic learning and character development at Tansol Treasures School, Iyana Ipaja, Lagos.',
};

const links = [
  ['About Us', '/about'],
  ['Why Us', '/why-us'],
  ['Curriculum', '/curriculum'],
  ['Admission', '/admission'],
  ['Gallery', '/gallery'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];

const aboutLinks = [
  ['Brief History', '/about/history'],
  ['Vision & Mission', '/about/vision-mission'],
  ["Proprietress' Desk", '/about/proprietress'],
];

const whyLinks = [
  ['Core Values', '/why-us/core-values'],
  ['Facilities', '/why-us/facilities'],
  ['Achievements', '/why-us/achievements'],
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
              <Link href="/about" className="text-sm text-[var(--muted)] transition hover:text-[var(--green)]">About Us</Link>
              <Link href="/why-us" className="text-sm text-[var(--muted)] transition hover:text-[var(--green)]">Why Us</Link>
              {links.slice(2).map(([label, href]) => <Link key={href} href={href} className="text-sm text-[var(--muted)] transition hover:text-[var(--green)]">{label}</Link>)}
            </nav>
            <Link href="/portal" className="rounded-full bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#103b2d]">School Portal</Link>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.3fr_.8fr_1fr]">
            <div><p className="eyebrow text-[var(--gold)]">Tansol Treasure School</p><h2 className="display mt-3 max-w-md text-3xl">A school built around curiosity, character and capability.</h2></div>
            <div>
              <p className="eyebrow text-[var(--muted)]">Explore</p>
              <div className="mt-4 grid gap-2 text-sm text-[var(--muted)]">
                <Link href="/about">About Us</Link>
                {aboutLinks.map(([label, href]) => <Link key={href} href={href} className="pl-3 text-xs">{label}</Link>)}
                <Link href="/why-us" className="mt-2">Why Us</Link>
                {whyLinks.map(([label, href]) => <Link key={href} href={href} className="pl-3 text-xs">{label}</Link>)}
                <Link href="/curriculum">Curriculum</Link><Link href="/admission">Admission</Link><Link href="/gallery">Gallery</Link><Link href="/blog">Blog</Link><Link href="/portal">School Portal</Link>
              </div>
            </div>
            <div>
              <p className="eyebrow text-[var(--muted)]">Connect</p>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--muted)]">
                <p>No 84 New Ipaja Road, Alagutan Bus Stop, Iyana Ipaja, Lagos</p>
                <Link href="tel:+2348023201622" className="hover:text-[var(--green)]">+234 802 320 1622</Link>
                <Link href="mailto:info@tansolschool.com.ng" className="break-all hover:text-[var(--green)]">info@tansolschool.com.ng</Link>
                <div className="mt-3 flex flex-wrap gap-4">
                  <a href="https://www.instagram.com/tansoltreasures_school/" target="_blank" rel="noreferrer" className="font-bold hover:text-[var(--green)]">Instagram</a>
                  <a href="https://www.facebook.com/share/1L66n56gZt/" target="_blank" rel="noreferrer" className="font-bold hover:text-[var(--green)]">Facebook</a>
                  <a href="https://www.tiktok.com/@tansoltreasures_school" target="_blank" rel="noreferrer" className="font-bold hover:text-[var(--green)]">TikTok</a>
                </div>
                <Link href="/contact" className="mt-2 font-bold text-[var(--green)]">Contact the school →</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} Tansol Treasure School. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
