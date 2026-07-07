import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/marketing/shell";
import { companyValues } from "@/lib/marketing";
import { Users, Video, MapPin, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "medicom's mission: quality healthcare for every Ghanaian, wherever they are.",
};

const stats = [
  { icon: Users, value: "500,000+", label: "Patients served" },
  { icon: Video, value: "1.2M+", label: "Video consultations" },
  { icon: MapPin, value: "16", label: "Regions covered" },
  { icon: Star, value: "4.9/5", label: "Average rating" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About medicom"
        title="Healthcare that meets you where you are"
        subtitle="We started medicom because seeing a doctor in Ghana too often meant a day of travel and queues for a ten-minute conversation. It doesn't have to."
      />

      <section className="py-16">
        <div className="container grid max-w-4xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Our story</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              medicom connects patients with licensed Ghanaian doctors, therapists and specialists over
              secure video — with e-prescriptions routed to nearby pharmacies, lab orders to partner labs,
              and every record in one place the patient controls.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Today our network spans all 16 regions, supported by clinician-reviewed AI triage that helps
              the right patients reach the right care first — with a licensed professional signing off on
              every recommendation.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">What we believe</h2>
            <ul className="mt-4 space-y-4">
              {companyValues.map((v) => (
                <li key={v.title}>
                  <p className="font-semibold text-slate-900">{v.title}</p>
                  <p className="text-sm text-slate-600">{v.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-50/70 py-14">
        <div className="container grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="mx-auto h-7 w-7 text-brand-600" />
              <div className="mt-3 font-display text-3xl font-bold text-slate-900">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Join us in rebuilding how Ghana gets care"
        body="Whether you're a patient, a clinician, or a partner — there's a place for you at medicom."
      />
    </>
  );
}
