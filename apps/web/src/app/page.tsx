import Link from "next/link";
import {
  ArrowRight, Play, Video, Pill, FlaskConical, HeartPulse, ShieldCheck, Clock,
  Stethoscope, Brain, User, Baby, Activity, PlusCircle, Check, Star, ChevronLeft,
  ChevronRight, MapPin, DollarSign, Lock, Award, Smartphone, Phone, MessageSquare,
  ClipboardList, Users, Facebook, Twitter, Instagram, Linkedin, Youtube,
} from "lucide-react";

/* Real imagery (verified reachable). */
const IMG = {
  heroDoctor: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
  appDoctor: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
};
const AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

/* ------------------------------- Logo ---------------------------------- */
function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className={`h-7 w-7 ${light ? "text-white" : "text-brand-600"}`} fill="currentColor" aria-hidden>
        <rect x="9.4" y="2.6" width="5.2" height="18.8" rx="2.4" />
        <rect x="2.6" y="9.4" width="18.8" height="5.2" rx="2.4" />
      </svg>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>medicom</span>
    </span>
  );
}

/* -------------------------------- Nav ---------------------------------- */
function NavBar() {
  const links = ["How It Works", "Services", "Our Doctors", "Pricing", "For Business", "Resources"];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/"><Logo /></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {links.map((l) => (
            <a key={l} href="#" className="transition hover:text-slate-900">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-700 transition hover:text-slate-900 sm:block">Log in</Link>
          <Link href="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- Hero --------------------------------- */
function Hero() {
  const phoneFeatures = [
    { icon: Video, title: "Video Visits", body: "Talk face-to-face with a doctor" },
    { icon: Pill, title: "Prescriptions", body: "Sent to your pharmacy" },
    { icon: FlaskConical, title: "Lab Orders", body: "Request lab work near you" },
    { icon: HeartPulse, title: "Follow-Up Care", body: "Ongoing support when you need it" },
  ];
  return (
    <section className="bg-gradient-to-br from-navy-950 via-navy to-navy-800">
      <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Healthcare<br />that&apos;s there<br />for you.{" "}
            <span className="text-blue-400">Anywhere.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
            Talk to licensed doctors, get prescriptions, and receive care from the comfort of home.
          </p>
          <div className="mt-8 flex flex-wrap gap-8">
            <TrustItem icon={ShieldCheck} title="Licensed Doctors" body="Board-certified & verified" />
            <TrustItem icon={Clock} title="Fast & Easy" body="See a doctor in minutes" />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
              <Play className="h-4 w-4 fill-current" /> See How It Works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-blue-400" /> HIPAA Compliant</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-blue-400" /> Secure</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-blue-400" /> Private</span>
          </div>
        </div>

        {/* Phone mockup + floating feature card */}
        <div className="relative mx-auto max-w-md">
          <div className="relative mx-auto w-[300px] rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
            <div className="overflow-hidden rounded-[1.9rem] bg-slate-800">
              <div className="relative">
                <img src={IMG.heroDoctor} alt="Doctor on a video visit" className="aspect-[9/16] w-full object-cover" />
                <div className="absolute left-3 top-3 rounded-lg bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur">Dr. Jessica Miller</div>
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700"><Video className="h-5 w-5" /></span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white"><Phone className="h-6 w-6" /></span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700"><MessageSquare className="h-5 w-5" /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-24 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block sm:-right-6 lg:-right-16">
            <div className="space-y-3">
              {phoneFeatures.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><f.icon className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                    <p className="text-xs text-slate-500">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-300"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">{body}</p>
      </div>
    </div>
  );
}

/* ------------------------------ Services ------------------------------- */
const services = [
  { icon: PlusCircle, title: "Urgent Care", body: "Care for colds, flu, fever, sprains, and other non-life-threatening conditions." },
  { icon: Brain, title: "Mental Health", body: "Therapy and psychiatry for anxiety, stress, depression and more." },
  { icon: User, title: "Primary Care", body: "Build a relationship with a doctor who knows you and your health history." },
  { icon: Baby, title: "Pediatrics", body: "Compassionate care for infants, children, and adolescents." },
  { icon: Activity, title: "Women's Health", body: "Care for every stage of your life — from menstruation to menopause." },
  { icon: HeartPulse, title: "Chronic Care", body: "Manage long-term conditions like diabetes, asthma, hypertension and more." },
];

function Services() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Care for every stage of life</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our services</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><s.icon className="h-7 w-7" /></span>
              <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">Learn more <ArrowRight className="h-4 w-4" /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- How it works ---------------------------- */
const steps = [
  { icon: Phone, title: "Create an account", body: "Sign up in minutes and complete your health profile." },
  { icon: ClipboardList, title: "Choose your care", body: "Select a service and pick the best time for your visit." },
  { icon: Video, title: "Meet with a doctor", body: "Connect via secure video on your phone, tablet, or computer." },
  { icon: Pill, title: "Get your treatment", body: "Receive a treatment plan, prescriptions, and follow-up care if needed." },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-white py-20">
      <div className="container">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Get care in 4 simple steps</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it works</h2>
        </div>
        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-slate-200 md:block" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-sm">
                <s.icon className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Why choose ------------------------------- */
const reasons = [
  { icon: Clock, title: "Convenient", body: "Care on your time, from wherever you are." },
  { icon: DollarSign, title: "Affordable", body: "Transparent pricing with no surprise bills." },
  { icon: Lock, title: "Secure & Private", body: "Your data is protected every step of the way." },
  { icon: Star, title: "Top Rated Doctors", body: "Licensed, board-certified providers." },
  { icon: ShieldCheck, title: "Insurance Friendly", body: "We accept most major insurance plans." },
];

function WhyChoose() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Why choose medicom</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Quality care. Built around you.</h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {reasons.map((r) => (
            <div key={r.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600"><r.icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{r.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Stats -------------------------------- */
function Stats() {
  const stats = [
    { icon: Users, value: "500,000+", label: "Patients served" },
    { icon: Star, value: "4.9/5", label: "Average patient rating" },
    { icon: HeartPulse, value: "98%", label: "Visit satisfaction rate" },
    { icon: MapPin, value: "16 Regions", label: "Available across Ghana" },
  ];
  return (
    <section className="bg-navy py-16 text-white">
      <div className="container text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Trusted by thousands</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Care you can count on</h2>
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <s.icon className="mx-auto h-7 w-7 text-blue-300" />
              <div className="mt-3 font-display text-3xl font-bold sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-slate-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- App ---------------------------------- */
function AppSection() {
  const items = ["Book or start a visit", "Message your care team", "Track prescriptions & orders", "Manage your health easily"];
  return (
    <section className="bg-white py-20">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div className="relative flex justify-center">
          <div className="w-[220px] rounded-[2rem] border-8 border-slate-900 bg-slate-900 shadow-xl">
            <div className="overflow-hidden rounded-[1.4rem]">
              <img src={IMG.appDoctor} alt="medicom app" className="aspect-[9/16] w-full object-cover" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">The medicom app</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Healthcare in your hand</h2>
          <p className="mt-4 max-w-md text-slate-600">Download the medicom app for iOS or Android to access care anytime, anywhere.</p>
          <ul className="mt-6 space-y-3">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Check className="h-3.5 w-3.5" /></span>
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreBadge top="Download on the" bottom="App Store" />
            <StoreBadge top="GET IT ON" bottom="Google Play" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({ top, bottom }: { top: string; bottom: string }) {
  return (
    <a href="#" className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-white transition hover:bg-slate-800">
      <Smartphone className="h-6 w-6" />
      <span className="text-left">
        <span className="block text-[10px] uppercase tracking-wide text-slate-300">{top}</span>
        <span className="block font-display text-base font-semibold leading-tight">{bottom}</span>
      </span>
    </a>
  );
}

/* ---------------------------- Testimonials ----------------------------- */
const testimonials = [
  { name: "Emily R.", img: AVATARS[0], body: "medicom made it so easy to get care when I needed it. The doctor was incredibly kind and thorough." },
  { name: "James T.", img: AVATARS[1], body: "I love being able to talk to my doctor from home. It's convenient, affordable, and fast." },
  { name: "Olivia M.", img: AVATARS[2], body: "The best telehealth experience I've had. Prescription was sent to my pharmacy within minutes." },
];

function Testimonials() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Patients love medicom</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Real patients. Real stories.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}
              </div>
              <blockquote className="mt-4 text-slate-700">“{t.body}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                <span>
                  <span className="block font-semibold text-slate-900">{t.name}</span>
                  <span className="block text-sm text-slate-500">Verified Patient</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50"><ChevronLeft className="h-5 w-5" /></button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Insurance ------------------------------- */
function Insurance() {
  const plans = ["NHIS", "GLICO Healthcare", "Acacia Health", "Nationwide Medical", "Premier Health"];
  return (
    <section className="bg-white py-14">
      <div className="container text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">We accept all major insurance plans</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {plans.map((p) => (
            <span key={p} className="font-display text-xl font-bold text-slate-400">{p}</span>
          ))}
          <span className="text-sm font-medium text-slate-400">and more</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Footer -------------------------------- */
function Footer() {
  const cols = [
    { h: "Company", items: ["About Us", "Careers", "Press", "Contact Us", "Blog"] },
    { h: "Services", items: ["Urgent Care", "Mental Health", "Primary Care", "Pediatrics", "Chronic Care"] },
    { h: "Resources", items: ["Help Center", "Patient Guide", "Insurance", "FAQ", "Health Articles"] },
    { h: "For Business", items: ["Employer Solutions", "Health Plans", "Partner With Us", "API & Developers"] },
  ];
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container grid gap-10 py-16 md:grid-cols-5">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-slate-300">Making quality healthcare accessible, convenient, and personal for everyone.</p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">{c.h}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {c.items.map((i) => (<li key={i}><a href="#" className="transition hover:text-white">{i}</a></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} medicom. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> HIPAA Compliant</span>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------- Page --------------------------------- */
export default function LandingPage() {
  return (
    <main className="bg-white text-slate-900">
      <NavBar />
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <AppSection />
      <Testimonials />
      <Insurance />
      <Footer />
    </main>
  );
}
