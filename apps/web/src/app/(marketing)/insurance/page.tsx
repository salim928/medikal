import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { insurancePartners } from "@/lib/marketing";
import { ShieldCheck, Receipt, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance",
  description: "Health plans that cover medicom visits, and how claims work.",
};

const steps = [
  { icon: BadgeCheck, title: "Check your cover", body: "Select your insurer during sign-up. We confirm your telehealth benefit instantly for supported plans." },
  { icon: ShieldCheck, title: "Book as normal", body: "Covered visits show a GH₵ 0 (or reduced) price at checkout — no paperwork before the visit." },
  { icon: Receipt, title: "We handle the claim", body: "medicom submits the claim directly to your insurer. You get a receipt for your records either way." },
];

export default function InsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance"
        title="Use your health cover on medicom"
        subtitle="We work with NHIS and Ghana's leading private insurers so covered members pay less — often nothing — per visit."
      />

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <s.icon className="h-6 w-6 text-brand-600" />
                <p className="mt-3 font-semibold text-slate-900">{s.title}</p>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50/60 py-16">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-slate-900">Accepted plans</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {insurancePartners.map((p) => (
              <div key={p.name} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-600 sm:max-w-md sm:text-right">{p.coverage}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Don&apos;t see your insurer? Coverage is expanding — <Link href="/contact" className="font-semibold text-brand-600">ask us</Link>, or
            pay per visit and claim reimbursement with the receipt we issue.
          </p>
        </div>
      </section>

      <CtaBand title="Check your cover in minutes" body="Sign up and select your insurer — we do the rest." />
    </>
  );
}
