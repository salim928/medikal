"use client";

import { useState } from "react";
import { PageHero } from "@/components/marketing/shell";
import { useToast } from "@/components/ui/toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const channels = [
  { icon: Mail, title: "Email", body: "support@medicom.app", href: "mailto:support@medicom.app" },
  { icon: Phone, title: "Phone", body: "+233 30 000 0000", href: "tel:+233300000000" },
  { icon: MapPin, title: "Office", body: "12 Independence Avenue, Accra, Ghana", href: undefined },
];

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setForm({ name: "", email: "", topic: "General question", message: "" });
    toast.success("Message sent — we reply within one working day");
  };

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="We're here to help"
        subtitle="Questions about visits, billing, partnerships or press — reach us any way you like."
      />

      <section className="py-16">
        <div className="container grid max-w-4xl gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {channels.map((c) => (
              <div key={c.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{c.title}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm text-brand-600 hover:text-brand-700">{c.body}</a>
                  ) : (
                    <p className="text-sm text-slate-600">{c.body}</p>
                  )}
                </div>
              </div>
            ))}
            <p className="text-sm text-slate-500">
              Existing patient with an urgent medical issue? Please book an urgent-care visit instead — this form is not monitored by clinicians.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">Your name</label>
                <input
                  id="name" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  id="email" type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
              </div>
            </div>
            <div>
              <label htmlFor="topic" className="mb-1.5 block text-sm font-semibold text-slate-700">Topic</label>
              <select
                id="topic" value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              >
                {["General question", "Billing", "Partnerships", "Careers", "Press", "Feedback"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">Message</label>
              <textarea
                id="message" required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
            </div>
            <button
              type="submit" disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
