import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { faqs } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the most common questions about medicom visits, billing and privacy.",
};

export default function FaqPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything patients ask us most — visits, prescriptions, billing and privacy."
      />
      <section className="py-16">
        <div className="container max-w-3xl space-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="font-display text-xl font-bold text-slate-900">{cat}</h2>
              <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                {faqs.filter((f) => f.category === cat).map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none group-open:text-brand-700">
                      {f.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm text-slate-500">
            Still stuck? Visit the <Link href="/help" className="font-semibold text-brand-600">Help Center</Link> or{" "}
            <Link href="/contact" className="font-semibold text-brand-600">contact us</Link> — we reply within one working day.
          </p>
        </div>
      </section>
      <CtaBand title="Ready when you are" body="Create an account and see a doctor today." />
    </>
  );
}
