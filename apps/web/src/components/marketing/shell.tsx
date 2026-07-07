/**
 * Shared shell for all public marketing pages (landing, company, services,
 * resources, business). Server-safe — no client state.
 */
import Link from "next/link";
import {
  ShieldCheck, Facebook, Twitter, Instagram, Linkedin, Youtube,
} from "lucide-react";

export function MarketingLogo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${light ? "text-white" : "text-brand-600"}`} fill="currentColor" aria-hidden>
        <rect x="9.4" y="2.6" width="5.2" height="18.8" rx="2.4" />
        <rect x="2.6" y="9.4" width="18.8" height="5.2" rx="2.4" />
      </svg>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>medicom</span>
    </span>
  );
}

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Our Doctors", href: "/providers" },
  { label: "Patient Guide", href: "/patient-guide" },
  { label: "For Business", href: "/business/employers" },
  { label: "Resources", href: "/help" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/"><MarketingLogo /></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="transition hover:text-slate-900">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-700 transition hover:text-slate-900 sm:block">Log in</Link>
          <Link href="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

const footerCols = [
  {
    h: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact Us", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    h: "Services",
    items: [
      { label: "Urgent Care", href: "/services/urgent-care" },
      { label: "Mental Health", href: "/services/mental-health" },
      { label: "Primary Care", href: "/services/primary-care" },
      { label: "Pediatrics", href: "/services/pediatrics" },
      { label: "Chronic Care", href: "/services/chronic-care" },
    ],
  },
  {
    h: "Resources",
    items: [
      { label: "Help Center", href: "/help" },
      { label: "Patient Guide", href: "/patient-guide" },
      { label: "Insurance", href: "/insurance" },
      { label: "FAQ", href: "/faq" },
      { label: "Health Articles", href: "/articles" },
    ],
  },
  {
    h: "For Business",
    items: [
      { label: "Employer Solutions", href: "/business/employers" },
      { label: "Health Plans", href: "/business/health-plans" },
      { label: "Partner With Us", href: "/business/partners" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-brand-700 text-white">
      <div className="container grid gap-10 py-16 md:grid-cols-5">
        <div className="md:col-span-1">
          <MarketingLogo light />
          <p className="mt-4 max-w-xs text-sm text-brand-100">Making quality healthcare accessible, convenient, and personal for everyone.</p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {footerCols.map((c) => (
          <div key={c.h}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{c.h}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100">
              {c.items.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className="transition hover:text-white">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-brand-100 sm:flex-row">
          <p>© {new Date().getFullYear()} medicom. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> HIPAA Compliant</span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Standard hero band for marketing subpages. */
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="bg-gradient-to-br from-white via-brand-50/60 to-brand-100/70 py-16">
      <div className="container max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{subtitle}</p>
      </div>
    </section>
  );
}

/** Bottom call-to-action band shared by marketing subpages. */
export function CtaBand({ title, body, cta = "Get Started", href = "/signup" }: { title: string; body: string; cta?: string; href?: string }) {
  return (
    <section className="bg-navy py-16 text-white">
      <div className="container max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-3 text-slate-300">{body}</p>
        <Link href={href} className="mt-7 inline-flex items-center justify-center rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-400">
          {cta}
        </Link>
      </div>
    </section>
  );
}
