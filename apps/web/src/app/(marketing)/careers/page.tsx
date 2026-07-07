import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { openRoles, companyValues } from "@/lib/marketing";
import { MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build the future of healthcare in Ghana. See open roles at medicom.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do the most important work of your career"
        subtitle="We're a team of clinicians, engineers and operators making quality healthcare reachable for every Ghanaian. Come build with us."
      />

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-slate-900">How we work</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {companyValues.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-semibold text-slate-900">{v.title}</p>
                <p className="mt-1 text-sm text-slate-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50/60 py-16">
        <div className="container max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-slate-900">Open roles</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {openRoles.map((r) => (
              <Link
                key={r.title}
                href="/contact"
                className="group flex flex-col gap-2 p-5 transition hover:bg-brand-50/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-brand-700">{r.title}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>{r.team}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{r.type}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Apply <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Don&apos;t see your role? Write to <a className="font-semibold text-brand-600" href="mailto:careers@medicom.app">careers@medicom.app</a> — we hire exceptional people year-round.
          </p>
        </div>
      </section>

      <CtaBand title="Ready to make care better?" body="Tell us about yourself — applications take five minutes." cta="Get in touch" href="/contact" />
    </>
  );
}
