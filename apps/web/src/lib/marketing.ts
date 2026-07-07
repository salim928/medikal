/**
 * Content for the public marketing pages (services, company, resources,
 * business). Copy lives here so pages stay thin and consistent.
 */
import {
  PlusCircle, Brain, User, Baby, HeartPulse, Video, ClipboardList, Pill,
  Building2, Landmark, Handshake, type LucideIcon,
} from "lucide-react";

/* -------------------------------- services ------------------------------- */

export interface ServicePage {
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  conditions: string[];
  included: string[];
  price: string;
}

export const servicePages: ServicePage[] = [
  {
    slug: "urgent-care",
    name: "Urgent Care",
    icon: PlusCircle,
    tagline: "See a doctor in minutes for everyday illnesses",
    description:
      "Colds, flu, fevers, infections, sprains and other non-life-threatening conditions — treated over secure video without a waiting room. Our doctors assess, treat, and prescribe where appropriate, usually within minutes of your request.",
    conditions: ["Cold & flu", "Fever", "Sore throat", "Urinary tract infections", "Skin rashes & bites", "Stomach upsets", "Minor injuries & sprains", "Eye infections"],
    included: ["Video consultation with a licensed doctor", "e-Prescription sent to a pharmacy near you", "Sick notes and referrals when needed", "Free follow-up message within 48 hours"],
    price: "From GH₵ 100 per visit",
  },
  {
    slug: "mental-health",
    name: "Mental Health",
    icon: Brain,
    tagline: "Therapy and psychiatry, on your schedule",
    description:
      "Confidential support for anxiety, stress, depression, grief and more, from licensed therapists and psychiatrists. Book one-off sessions or ongoing care — every conversation stays private and secure.",
    conditions: ["Anxiety & panic", "Depression", "Stress & burnout", "Grief & loss", "Relationship difficulties", "Sleep problems", "ADHD assessment", "Trauma support"],
    included: ["45-minute video therapy sessions", "Psychiatric evaluation & medication management", "Personalised care plans", "Secure messaging with your therapist between sessions"],
    price: "From GH₵ 100 per session",
  },
  {
    slug: "primary-care",
    name: "Primary Care",
    icon: User,
    tagline: "A doctor who knows you and your history",
    description:
      "Build an ongoing relationship with a dedicated doctor who manages your everyday health — preventive check-ups, screenings, lab reviews and coordinated referrals, all in one place.",
    conditions: ["Annual check-ups", "Preventive screenings", "Lab test orders & reviews", "Vaccination advice", "Weight & lifestyle management", "Sexual health", "Travel medicine", "General health questions"],
    included: ["A named primary care doctor", "Preventive care calendar & reminders", "Lab orders with results explained in plain language", "Coordinated specialist referrals"],
    price: "Included in all medicom plans",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    icon: Baby,
    tagline: "Compassionate care for infants, children and teens",
    description:
      "From newborn worries to teenage health, our paediatricians support your family with video visits, growth and development guidance, and rapid advice when your child is unwell.",
    conditions: ["Fevers & infections", "Coughs, colds & flu", "Rashes & allergies", "Feeding & nutrition", "Growth & development checks", "Immunisation schedules", "Behavioural concerns", "Teen health"],
    included: ["Paediatrician video visits, 7 days a week", "Parent guidance for common childhood illnesses", "Immunisation schedule tracking", "Referrals to in-person care when needed"],
    price: "From GH₵ 120 per visit",
  },
  {
    slug: "chronic-care",
    name: "Chronic Care",
    icon: HeartPulse,
    tagline: "Ongoing support for long-term conditions",
    description:
      "Structured management for diabetes, hypertension, asthma and other chronic conditions: regular reviews, medication management, and a care team that tracks your progress between visits.",
    conditions: ["Type 2 diabetes", "Hypertension", "Asthma & COPD", "High cholesterol", "Thyroid conditions", "Arthritis", "Heart disease follow-up", "Chronic pain"],
    included: ["Scheduled review visits with the same doctor", "Medication management & refill coordination", "Home-reading tracking (BP, glucose)", "Escalation to specialists when readings change"],
    price: "From GH₵ 150 per month",
  },
];

export function getServicePage(slug: string): ServicePage | null {
  return servicePages.find((s) => s.slug === slug) ?? null;
}

/* -------------------------------- business ------------------------------- */

export interface BusinessPage {
  slug: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  benefits: { title: string; body: string }[];
  cta: string;
}

export const businessPages: BusinessPage[] = [
  {
    slug: "employers",
    name: "Employer Solutions",
    icon: Building2,
    tagline: "Healthier teams, fewer sick days",
    description:
      "Give your employees and their families 24/7 access to doctors, mental-health support and chronic-care management — one subscription, no clinic queues, measurable impact on absence and retention.",
    benefits: [
      { title: "Reduce absenteeism", body: "Employees see a doctor in minutes instead of losing half a day to a clinic visit." },
      { title: "Support mental wellbeing", body: "Confidential therapy and psychiatry included in every employer plan." },
      { title: "Simple administration", body: "One dashboard for enrolment, utilisation reporting and billing." },
      { title: "Family coverage", body: "Extend cover to spouses and children at preferential rates." },
    ],
    cta: "Talk to our employer team",
  },
  {
    slug: "health-plans",
    name: "Health Plans",
    icon: Landmark,
    tagline: "Telehealth infrastructure for insurers",
    description:
      "Embed medicom's virtual-care network into your health plans. Reduce claims costs with early intervention, extend your reach beyond urban centres, and give members care they actually use.",
    benefits: [
      { title: "Lower claims costs", body: "Virtual-first triage resolves most primary-care claims without facility fees." },
      { title: "Wider network", body: "Members in all 16 regions get the same access — no physical footprint needed." },
      { title: "Clean integration", body: "Eligibility checks, claims data and utilisation reports delivered your way." },
      { title: "Member satisfaction", body: "Care in minutes is the benefit members talk about." },
    ],
    cta: "Partner on a health plan",
  },
  {
    slug: "partners",
    name: "Partner With Us",
    icon: Handshake,
    tagline: "Pharmacies, labs, hospitals and clinics",
    description:
      "Join the medicom network. We route prescriptions to partner pharmacies, lab orders to partner labs, and in-person referrals to partner clinics — growing your patient volume while we handle the digital experience.",
    benefits: [
      { title: "Pharmacies", body: "Receive verified e-prescriptions and delivery orders from medicom doctors." },
      { title: "Diagnostic labs", body: "Digital lab orders with structured results flowing back to the patient record." },
      { title: "Clinics & hospitals", body: "Receive referrals for in-person care with full visit context attached." },
      { title: "Specialists", body: "Consult on the platform with scheduling, notes and billing handled for you." },
    ],
    cta: "Apply to join the network",
  },
];

export function getBusinessPage(slug: string): BusinessPage | null {
  return businessPages.find((b) => b.slug === slug) ?? null;
}

/* --------------------------------- posts --------------------------------- */

export interface Post {
  slug: string;
  title: string;
  category: "news" | "health";
  excerpt: string;
  date: string;
  readMinutes: number;
  author: string;
}

export const posts: Post[] = [
  { slug: "medikal-launches-ghana", title: "medicom launches nationwide telehealth across Ghana", category: "news", excerpt: "Starting today, patients in all 16 regions can see licensed doctors over secure video, get e-prescriptions, and verify medications against the Ghana FDA registry.", date: "Jun 12, 2026", readMinutes: 3, author: "medicom Team" },
  { slug: "nhis-partnership", title: "medicom partners with NHIS on virtual-first primary care", category: "news", excerpt: "A new pilot brings medicom video consultations to NHIS members, cutting travel time and clinic queues for routine care.", date: "May 28, 2026", readMinutes: 4, author: "medicom Team" },
  { slug: "triage-milestone", title: "AI triage reviews its 100,000th case — with a doctor signing every one", category: "news", excerpt: "Our clinician-in-the-loop triage model has now handled 100,000 symptom submissions. Here's what we learned about safe AI in healthcare.", date: "Apr 15, 2026", readMinutes: 5, author: "Clinical Team" },
  { slug: "understanding-hypertension", title: "Understanding hypertension: the silent condition one in three adults carries", category: "health", excerpt: "High blood pressure rarely announces itself. Learn the numbers that matter, what they mean, and the everyday habits that bring them down.", date: "Jun 20, 2026", readMinutes: 6, author: "Dr. James Wilson" },
  { slug: "malaria-vs-flu", title: "Malaria or flu? How to tell the difference — and when to test", category: "health", excerpt: "Fever, aches and fatigue overlap between malaria and viral illness. A doctor explains the warning signs that mean you should test immediately.", date: "Jun 5, 2026", readMinutes: 5, author: "Dr. Sarah Johnson" },
  { slug: "child-fever-guide", title: "Your child has a fever: a paediatrician's step-by-step guide", category: "health", excerpt: "What temperature counts as a fever, what you can safely do at home, and the red flags that mean you should seek care now.", date: "May 22, 2026", readMinutes: 7, author: "Dr. Ama Mensah" },
  { slug: "diabetes-plate-method", title: "The plate method: managing type 2 diabetes without weighing food", category: "health", excerpt: "A practical, Ghana-friendly way to build balanced meals that keep blood sugar steady — no calorie counting required.", date: "May 10, 2026", readMinutes: 6, author: "Nutrition Team" },
  { slug: "therapy-first-session", title: "What actually happens in your first therapy session", category: "health", excerpt: "Nervous about starting therapy? A licensed therapist walks through the first 45 minutes, so you know exactly what to expect.", date: "Apr 30, 2026", readMinutes: 5, author: "Dr. Kwame Asante" },
];

/* -------------------------------- careers -------------------------------- */

export interface Role {
  title: string;
  team: string;
  location: string;
  type: string;
}

export const openRoles: Role[] = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Accra / Remote", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Accra / Remote", type: "Full-time" },
  { title: "Telehealth Physician (GP)", team: "Clinical", location: "Remote (Ghana-licensed)", type: "Part-time / Full-time" },
  { title: "Licensed Therapist", team: "Clinical", location: "Remote (Ghana-licensed)", type: "Part-time" },
  { title: "Clinical Operations Manager", team: "Operations", location: "Accra", type: "Full-time" },
  { title: "Partnerships Lead — Pharmacies", team: "Business", location: "Kumasi", type: "Full-time" },
];

export const companyValues = [
  { title: "Patients before everything", body: "Every decision starts with whether it makes care better, faster, or safer for the patient." },
  { title: "Clinicians in the loop", body: "Technology assists; licensed professionals decide. Always." },
  { title: "Care for every region", body: "Quality healthcare shouldn't depend on living near a big city." },
  { title: "Earn trust daily", body: "Health data is sacred. We protect it like our own." },
];

/* --------------------------------- press --------------------------------- */

export const pressReleases = [
  { date: "Jun 12, 2026", title: "medicom launches nationwide telehealth service across Ghana", outlet: "Press release" },
  { date: "May 28, 2026", title: "NHIS and medicom announce virtual-first primary care pilot", outlet: "Press release" },
  { date: "May 02, 2026", title: "\"The clinic in your pocket\" — feature on Ghana's telehealth wave", outlet: "Joy Business" },
  { date: "Apr 15, 2026", title: "medicom's clinician-reviewed AI triage passes 100,000 cases", outlet: "Press release" },
  { date: "Mar 20, 2026", title: "How drug verification is fighting counterfeit medicine", outlet: "Citi Newsroom" },
];

/* ---------------------------------- FAQ ---------------------------------- */

export interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const faqs: FaqItem[] = [
  { category: "Getting started", q: "How do I see a doctor?", a: "Create an account, choose the type of care you need, pick a time (or start instantly for urgent care), and connect over secure video. Most visits start within minutes." },
  { category: "Getting started", q: "What do I need for a video visit?", a: "A smartphone, tablet or computer with a camera, and an internet connection. The visit runs in your browser — no installation required." },
  { category: "Getting started", q: "Where is medicom available?", a: "Across all 16 regions of Ghana. Provider availability is deepest in Accra, Kumasi, Cape Coast and Tamale." },
  { category: "Visits & prescriptions", q: "Can doctors prescribe medication online?", a: "Yes. Licensed doctors issue e-prescriptions during your visit, sent directly to a partner pharmacy near you — many offer home delivery." },
  { category: "Visits & prescriptions", q: "Can I choose my doctor?", a: "Yes. Browse doctor profiles, ratings and specialties, and book directly — or let us match you with the first available clinician." },
  { category: "Visits & prescriptions", q: "What if I need in-person care?", a: "Your doctor will refer you to a partner clinic, lab or hospital with your visit summary attached, so you never repeat your story." },
  { category: "Billing", q: "How much does a visit cost?", a: "Urgent care visits start from GH₵ 100. Subscription plans from GH₵ 99/month include unlimited video consultations. You always see the price before you book." },
  { category: "Billing", q: "What payment methods do you accept?", a: "Mobile money (MTN, Vodafone, AirtelTigo), cards via Paystack or Stripe, and bank transfer." },
  { category: "Billing", q: "Do you accept insurance?", a: "We work with NHIS and leading private insurers. See the Insurance page for the current list and how claims work." },
  { category: "Privacy & security", q: "Is my health information private?", a: "Yes. All visits are encrypted end-to-end, records are stored securely, and nothing is shared without your explicit consent. Our practices align with HIPAA standards." },
  { category: "Privacy & security", q: "Who can see my medical records?", a: "Only you and the clinicians treating you. You can share records with an outside provider yourself at any time." },
];

/* ------------------------------ patient guide ---------------------------- */

export const guideSteps = [
  { icon: User, title: "Create your account", body: "Sign up with your name and phone or email, then complete a short health profile — allergies, conditions, medications. It takes about three minutes and makes every future visit faster." },
  { icon: ClipboardList, title: "Tell us what's wrong", body: "Use the symptom checker for guidance, or go straight to booking. Choose the type of care, a doctor if you have a preference, and a time that suits you." },
  { icon: Video, title: "Meet your doctor on video", body: "Join from the appointment card at your scheduled time. Your doctor reviews your profile beforehand, so the visit is about you — not paperwork." },
  { icon: Pill, title: "Get treatment and follow-up", body: "Prescriptions go to a pharmacy near you (delivery available), lab orders to a partner lab, and your visit summary lands in your records. Follow-up messages are free for 48 hours." },
];

/* -------------------------------- insurance ------------------------------ */

export const insurancePartners = [
  { name: "NHIS", coverage: "Virtual-first primary care pilot — consultations covered for enrolled members" },
  { name: "GLICO Healthcare", coverage: "Video consultations + e-prescriptions on corporate schemes" },
  { name: "Acacia Health", coverage: "Full telehealth benefit on Gold and Platinum plans" },
  { name: "Nationwide Medical", coverage: "Urgent care and chronic-care programmes" },
  { name: "Premier Health", coverage: "Mental-health sessions and primary care" },
];
