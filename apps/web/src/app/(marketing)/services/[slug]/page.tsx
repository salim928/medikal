import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/marketing/shell";
import { servicePages, getServicePage } from "@/lib/marketing";
import { Check, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return { title: "Service not found" };
  return { title: service.name, description: service.tagline };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-brand-50/60 to-brand-100/70 py-16">
        <div className="container max-w-3xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <service.icon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{service.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{service.tagline}</p>
          <p className="mt-2 text-sm font-semibold text-brand-700">{service.price}</p>
          <Link
            href="/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            Book a visit <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="container grid max-w-4xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">How it works</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{service.description}</p>
            <h3 className="mt-8 font-display text-lg font-semibold text-slate-900">What&apos;s included</h3>
            <ul className="mt-3 space-y-2.5">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Commonly treated</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.conditions.map((c) => (
                <span key={c} className="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm text-brand-800">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-brand-50/60 p-5 text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-900">Emergency?</strong> medicom is not for life-threatening situations.
              If someone is seriously unwell — severe chest pain, difficulty breathing, heavy bleeding — go to the
              nearest emergency department or call the national ambulance service on 112.
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={`See a ${service.name.toLowerCase()} clinician today`}
        body="Most visits start within minutes of booking."
        cta="Get Started"
      />
    </>
  );
}
