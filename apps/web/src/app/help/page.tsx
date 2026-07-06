"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Video,
  FileText,
  CreditCard,
  Shield,
  Users,
  MessageSquare,
  Phone,
  Mail
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' in the top right corner, fill in your information, and verify your email address. You'll then be able to access all medicom features."
  },
  {
    category: "Getting Started",
    question: "Is medicom available in my area?",
    answer: "medicom operates in all 50 US states. Healthcare provider availability may vary by location. Use our 'Find Doctors' feature to see providers in your area."
  },
  {
    category: "Appointments",
    question: "How do I book an appointment?",
    answer: "Navigate to Appointments > Book New Appointment. Select your preferred doctor, date, time, and appointment type. You'll receive a confirmation email with appointment details."
  },
  {
    category: "Appointments",
    question: "Can I cancel or reschedule an appointment?",
    answer: "Yes! Go to your appointment details and click 'Reschedule' or 'Cancel'. Cancellations 24+ hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee."
  },
  {
    category: "Appointments",
    question: "What should I prepare for my first appointment?",
    answer: "Have your medical history ready, including current medications, allergies, and past conditions. For video calls, ensure you have a stable internet connection and a quiet, private space."
  },
  {
    category: "Video Consultations",
    question: "How do I join a video consultation?",
    answer: "Click the green 'Join Video Call' button on your appointment card or detail page. This will open the video consultation room. Make sure to allow camera and microphone access when prompted."
  },
  {
    category: "Video Consultations",
    question: "What are the technical requirements for video calls?",
    answer: "You need a device with a camera and microphone, a stable internet connection (minimum 2 Mbps), and a modern web browser (Chrome, Firefox, Safari, or Edge). No software installation required!"
  },
  {
    category: "Video Consultations",
    question: "What if I have technical issues during a call?",
    answer: "Check your internet connection, refresh the page, or try a different browser. If issues persist, contact support immediately. Your provider can also call you by phone as a backup."
  },
  {
    category: "Medical Records",
    question: "How do I upload medical records?",
    answer: "Go to Records > Upload Record. You can upload PDFs, images (JPG, PNG), or other document formats. Add a title and description for easy organization."
  },
  {
    category: "Medical Records",
    question: "Are my medical records secure?",
    answer: "Absolutely! We use bank-level encryption (AES-256) and are fully HIPAA-compliant. Only you and your authorized healthcare providers can access your records."
  },
  {
    category: "Medical Records",
    question: "Can I share records with other doctors?",
    answer: "Yes! You can grant access to specific providers or download records to share externally. Go to Settings > Privacy to manage record sharing permissions."
  },
  {
    category: "Prescriptions",
    question: "How do prescriptions work?",
    answer: "After your consultation, your provider can write a prescription directly in medicom. You'll receive a notification when it's ready, and it will be sent to your chosen pharmacy."
  },
  {
    category: "Prescriptions",
    question: "Can I request a refill?",
    answer: "Yes! Go to Prescriptions, find the medication, and click 'Request Refill'. Your provider will review and approve if appropriate. Some prescriptions may require a new consultation."
  },
  {
    category: "Billing & Insurance",
    question: "How much do consultations cost?",
    answer: "Consultation fees vary by provider and appointment type, typically ranging from $50-$200. You'll see the exact cost before booking. Some insurance plans may cover telemedicine."
  },
  {
    category: "Billing & Insurance",
    question: "Do you accept insurance?",
    answer: "We accept most major insurance plans. Add your insurance information in Settings > Profile. We'll verify coverage and inform you of any out-of-pocket costs before your appointment."
  },
  {
    category: "Billing & Insurance",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and HSA/FSA cards. Payment is processed securely through Stripe."
  },
  {
    category: "Privacy & Security",
    question: "Is my health information private?",
    answer: "Yes! We are fully HIPAA-compliant. All data is encrypted, and we never share your information without your explicit consent. Read our Privacy Policy for full details."
  },
  {
    category: "Privacy & Security",
    question: "Who can see my medical information?",
    answer: "Only you and healthcare providers directly involved in your care can access your Protected Health Information (PHI). You control sharing permissions in Privacy Settings."
  },
  {
    category: "Privacy & Security",
    question: "How do I enable two-factor authentication?",
    answer: "Go to Settings > Security > Two-Factor Authentication. Scan the QR code with an authenticator app (Google Authenticator, Authy) and save your backup codes."
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-canvas py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-8 border border-slate-200 mb-8 text-center">
          <HelpCircle className="w-16 h-16 text-brand-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-ink mb-2">Help Center</h1>
          <p className="text-slate-600 text-lg">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === "All"
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-mist"
            }`}
          >
            All Topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-600 hover:bg-mist"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No results found for "{searchTerm}"</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-200 transition"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-start gap-4 hover:bg-white/70 transition"
                >
                  <div className="flex-1">
                    <span className="text-xs text-brand-600 font-semibold mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-ink">
                      {faq.question}
                    </h3>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 text-slate-600 border-t border-slate-200 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/appointments/book"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-500 transition group"
          >
            <Calendar className="w-8 h-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-ink mb-2">Book Appointment</h3>
            <p className="text-sm text-slate-500">
              Schedule a consultation with a healthcare provider
            </p>
          </Link>

          <Link
            href="/appointments"
            className="bg-white border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition group"
          >
            <Video className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-ink mb-2">Video Consultations</h3>
            <p className="text-sm text-slate-500">
              Join your upcoming video appointments
            </p>
          </Link>

          <Link
            href="/records/upload"
            className="bg-white border border-brand-500/30 rounded-lg p-6 hover:border-brand-500 transition group"
          >
            <FileText className="w-8 h-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-ink mb-2">Upload Records</h3>
            <p className="text-sm text-slate-500">
              Add your medical records securely
            </p>
          </Link>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-8 border border-blue-500/30">
          <div className="text-center mb-6">
            <MessageSquare className="w-12 h-12 text-brand-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-ink mb-2">Still Need Help?</h2>
            <p className="text-slate-600">Our support team is here to assist you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <Phone className="w-8 h-8 text-brand-600 mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Phone Support</h3>
              <a href="tel:+1-555-MEDICAL" className="text-brand-600 hover:text-brand-700">
                1-555-MEDICAL
              </a>
              <p className="text-sm text-slate-500 mt-2">24/7 Available</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <Mail className="w-8 h-8 text-brand-600 mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Email Support</h3>
              <a href="mailto:support@mediconnect.com" className="text-brand-600 hover:text-brand-700 break-all">
                support@mediconnect.com
              </a>
              <p className="text-sm text-slate-500 mt-2">Response within 24 hours</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <MessageSquare className="w-8 h-8 text-brand-600 mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Live Chat</h3>
              <button className="text-brand-600 hover:text-brand-700">
                Start Chat
              </button>
              <p className="text-sm text-slate-500 mt-2">Mon-Fri, 9am-5pm PST</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
          <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-brand-600 hover:text-brand-700">
            Terms of Service
          </Link>
          <Link href="/dashboard" className="text-brand-600 hover:text-brand-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
