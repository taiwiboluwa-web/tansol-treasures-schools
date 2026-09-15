import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import schoolLogo from './gallery/Tansol school.png';
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

function InstagramIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>;
}
function FacebookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M14.2 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H8.4V13h2.7v8h3.1Z"/></svg>;
}
function TikTokIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M15.4 3c.3 1.9 1.4 3.1 3.3 3.3v3.1c-1.2 0-2.3-.3-3.3-.9v5.8c0 3.5-2.3 5.7-5.4 5.7-3 0-5.2-2.1-5.2-5 0-3.2 2.7-5.4 6-5.1v3.2c-1.6-.2-2.8.6-2.8 2 0 1.1.8 1.8 1.9 1.8 1.3 0 2.3-.9 2.3-2.6V3h3.2Z"/></svg>;
}

function SchoolLogo({ className = 'h-11 w-auto' }: { className?: string }) {
  return <Image src={schoolLogo} alt="Tansol Treasure School logo" className={`${className} object-contain`} priority sizes="(max-width: 640px) 190px, 220px" />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--line)] bg-white/95 backdrop-blur">
          <div className="page-shell flex min-h-20 items-center justify-between gap-6 py-2">
            <Link href="/" className="flex min-w-0 items-center" aria-label="Tansol Treasure School home">
              <SchoolLogo className="h-12 w-auto max-w-[190px] sm:h-14" />
            </Link>
            <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
              <Link href="/about" className="rounded-full px-2 py-2 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]">About Us</Link>
              <Link href="/why-us" className="rounded-full px-2 py-2 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--sky)] hover:text-[var(--brand)]">Why Us</Link>
              {links.slice(2).map(([label, href]) => <Link key={href} href={href} className="rounded-full px-2 py-2 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--mint)] hover:text-[var(--brand)]">{label}</Link>)}
            </nav>
            <Link href="/portal" className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-bold !text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] hover:shadow-md">School Portal</Link>
          </div>
        </header>
        {children}
        <footer className="mt-24 border-t border-[var(--line)] bg-white">
          <div className="page-shell grid gap-12 py-14 lg:grid-cols-[1.25fr_.75fr_1fr] lg:py-16">
            <div>
              <div className="flex items-center"><SchoolLogo className="h-14 w-auto max-w-[220px]" /></div>
              <p className="eyebrow mt-4 text-[var(--gold)]">Established 2009</p>
              <h2 className="display mt-5 max-w-md text-4xl leading-tight">A happy place to learn, grow and shine.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">Quality education, character development and practical learning in Iyana Ipaja, Lagos.</p>
              <div className="mt-6 flex gap-2">
                <span className="size-3 rounded-full bg-[var(--sun)]" /><span className="size-3 rounded-full bg-[var(--brand)]" /><span className="size-3 rounded-full bg-[#63c8ed]" /><span className="size-3 rounded-full bg-[#72d59a]" />
              </div>
            </div>
            <div>
              <p className="eyebrow text-[var(--muted)]">Explore</p>
              <nav className="mt-5 grid gap-3 text-sm" aria-label="Footer navigation">{links.slice(0, 6).map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[var(--brand)]">{label}</Link>)}</nav>
            </div>
            <div>
              <p className="eyebrow text-[var(--muted)]">Visit & connect</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--muted)]">
                <p>No 84 New Ipaja Road, Alagutan Bus Stop, Iyana Ipaja, Lagos</p>
                <Link href="tel:+2348023201622" className="block font-bold text-[var(--ink)] hover:text-[var(--brand)]">+234 802 320 1622</Link>
                <Link href="mailto:info@tansolschool.com.ng" className="block break-all font-bold text-[var(--ink)] hover:text-[var(--brand)]">info@tansolschool.com.ng</Link>
                <div className="flex items-center gap-3 pt-2" aria-label="Tansol Treasure School social media">
                  <a href="https://www.instagram.com/tansoltreasures_school/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="grid size-10 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)] transition hover:-translate-y-1 hover:bg-[var(--brand)] hover:text-white"><InstagramIcon /></a>
                  <a href="https://www.facebook.com/share/1L66n56gZt/" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" className="grid size-10 place-items-center rounded-full bg-[var(--sky)] text-[var(--brand)] transition hover:-translate-y-1 hover:bg-[var(--brand)] hover:text-white"><FacebookIcon /></a>
                  <a href="https://www.tiktok.com/@tansoltreasures_school" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" className="grid size-10 place-items-center rounded-full bg-[var(--mint)] text-[var(--brand)] transition hover:-translate-y-1 hover:bg-[var(--brand)] hover:text-white"><TikTokIcon /></a>
                </div>
                <Link href="/contact" className="inline-block pt-1 font-bold text-[var(--brand)] hover:text-[var(--brand-dark)]">Contact the school →</Link>
              </div>
            </div>
          </div>
          <div className="bg-[var(--brand-dark)] text-white"><div className="page-shell flex flex-col gap-2 py-5 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Tansol Treasure School. All rights reserved. Established 2009.</p><Link href="/portal" className="font-bold !text-white hover:text-white/80">School Portal →</Link></div></div>
        </footer>
      </body>
    </html>
  );
}
