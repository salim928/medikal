import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/marketing/shell";
import { businessPages, getBusinessPage } from "@/lib/marketing";
import { ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return businessPages.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getBusinessPage(slug);
  if (!page) return { title: "Not found" };
  return { title: page.name, description: page.tagline };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getBusinessPage(slug);
  if (!page) notFound();

  const others = businessPages.filter((b) => b.slug !== page.slug);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-brand-50/60 to-brand-100/70 py-16">
        <div className="container max-w-3xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <page.icon className="h-7 w-7" />
          </span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-brand-600">For business</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{page.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{page.tagline}</p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            {page.cta} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <p className="mx-auto max-w-2xl text-center leading-relaxed text-slate-600">{page.description}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-display text-lg font-semibold text-slate-900">{b.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{b.body}</p>
              </div>
            ))}
          </div>

          {/* Cross-links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-slate-500">Also for business:</span>
            {others.map((o) => (
              <Link key={o.slug} href={`/business/${o.slug}`} className="font-semibold text-brand-600 hover:text-brand-700">
                {o.name} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's talk about your organisation"
        body="Tell us your headcount and goals — we'll come back with a proposal within two working days."
        cta={page.cta}
        href="/contact"
      />
    </>
  );
}
