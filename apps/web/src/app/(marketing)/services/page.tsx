import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { servicePages } from "@/lib/marketing";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Urgent care, mental health, primary care, pediatrics and chronic care — over secure video.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Care for every stage of life"
        subtitle="Licensed Ghanaian doctors and therapists, available over secure video — usually within minutes."
      />
      <section className="py-16">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <s.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">{s.name}</h2>
              <p className="mt-1 flex-1 text-sm text-slate-600">{s.tagline}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{s.price}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Not sure which service you need?" body="Start with the symptom checker — it points you to the right care." />
    </>
  );
}
