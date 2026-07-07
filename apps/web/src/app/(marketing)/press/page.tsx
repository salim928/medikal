import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/shell";
import { pressReleases } from "@/lib/marketing";
import { Newspaper, Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Press",
  description: "medicom in the news — press releases, coverage and media resources.",
};

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Press"
        title="medicom in the news"
        subtitle="Announcements, coverage and everything journalists need to write about virtual care in Ghana."
      />

      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-slate-900">Latest announcements</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {pressReleases.map((p) => (
              <div key={p.title} className="flex items-start gap-4 p-5">
                <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Newspaper className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{p.outlet} · {p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50/60 py-14">
        <div className="container grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Download className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-semibold text-slate-900">Brand & media kit</p>
            <p className="mt-1 text-sm text-slate-600">Logos, product screenshots and founder photos, cleared for editorial use.</p>
            <a href="mailto:press@medicom.app?subject=Media%20kit%20request" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">Request the kit →</a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Mail className="h-6 w-6 text-brand-600" />
            <p className="mt-3 font-semibold text-slate-900">Media enquiries</p>
            <p className="mt-1 text-sm text-slate-600">For interviews, comment or data, our team replies within one working day.</p>
            <a href="mailto:press@medicom.app" className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">press@medicom.app →</a>
          </div>
        </div>
      </section>
    </>
  );
}
