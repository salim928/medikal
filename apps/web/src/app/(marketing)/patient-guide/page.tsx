import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { guideSteps } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Patient Guide",
  description: "How to use medicom, from sign-up to your first video visit.",
};

export default function PatientGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Patient guide"
        title="Your first visit, step by step"
        subtitle="From sign-up to prescription in four simple steps — most patients finish their first visit within half an hour."
      />

      <section className="py-16">
        <div className="container max-w-3xl">
          <ol className="space-y-6">
            {guideSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="relative flex-shrink-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">{s.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-brand-50/60 p-6 text-sm leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">Good to know</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              <li>Visits work in your browser — nothing to install.</li>
              <li>You can invite a family member or caregiver into any video visit.</li>
              <li>Every visit summary, prescription and lab result stays in your records, which you control.</li>
              <li>Questions mid-way? The <Link href="/help" className="font-semibold text-brand-600">Help Center</Link> covers the details.</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title="That's all there is to it" body="Create your account now — your first visit could be minutes away." />
    </>
  );
}
