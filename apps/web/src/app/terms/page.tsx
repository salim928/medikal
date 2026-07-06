"use client";

import Link from "next/link";
import { FileText, CheckCircle, XCircle, AlertTriangle, Users, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-8 border border-blue-500/30 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-12 h-12 text-brand-600" />
            <div>
              <h1 className="text-4xl font-bold text-ink">Terms of Service</h1>
              <p className="text-slate-600 mt-2">Last Updated: October 17, 2025</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Please read these terms carefully before using medicom.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">1. Acceptance of Terms</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                By accessing or using medicom ("Service"), you agree to be bound by these 
                Terms of Service ("Terms"). If you do not agree to these Terms, please do not 
                use our Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and medicom, Inc. 
                ("we," "us," "our").
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">2. Eligibility & Account Registration</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p><strong>Eligibility:</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You must be at least 18 years old to use medicom</li>
                <li>Minors may use the Service with parental/guardian consent</li>
                <li>You must provide accurate and complete information</li>
                <li>Healthcare providers must have valid licenses and credentials</li>
              </ul>
              <p className="mt-3"><strong>Account Security:</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>You are responsible for all activities under your account</li>
                <li>We recommend enabling two-factor authentication (2FA)</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">3. Healthcare Services</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p><strong>Telemedicine Services:</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>medicom facilitates connections between patients and licensed healthcare providers</li>
                <li>We do not provide medical advice or diagnoses directly</li>
                <li>Healthcare providers are independent contractors, not our employees</li>
                <li>Medical advice should be followed at your own discretion after consultation</li>
              </ul>
              <p className="mt-3"><strong>Not for Emergencies:</strong></p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-2">
                <p className="text-red-600 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  IMPORTANT: Do not use medicom for medical emergencies
                </p>
                <p className="text-slate-600 mt-2">
                  In case of emergency, call 911 or visit your nearest emergency room immediately.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">4. User Responsibilities</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Provide accurate and truthful health information</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Respect the privacy and confidentiality of others</li>
                <li>Not share your account credentials with others</li>
                <li>Attend scheduled appointments or cancel with appropriate notice</li>
                <li>Pay all fees for services rendered</li>
                <li>Follow provider instructions and treatment plans</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">5. Prohibited Conduct</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>You may NOT:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Use the Service to obtain controlled substances illegally</li>
                <li>Impersonate another person or healthcare provider</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Attempt to hack, disrupt, or interfere with the Service</li>
                <li>Scrape, copy, or download content without permission</li>
                <li>Harass, abuse, or threaten other users or providers</li>
                <li>Share explicit, offensive, or inappropriate content</li>
                <li>Use the Service for research without consent</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">6. Payments & Refunds</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p><strong>Fees:</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Consultation fees are set by individual healthcare providers</li>
                <li>Platform fees may apply for certain services</li>
                <li>All fees are displayed before booking</li>
                <li>Payment is required at time of booking or service completion</li>
              </ul>
              <p className="mt-3"><strong>Refund Policy:</strong></p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Cancellations 24+ hours before appointment: Full refund</li>
                <li>Cancellations less than 24 hours: 50% refund</li>
                <li>No-shows: No refund</li>
                <li>Provider cancellations: Full refund or reschedule</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">7. Privacy & Data Protection</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                Your use of medicom is also governed by our <Link href="/privacy" className="text-brand-600 hover:text-brand-700">Privacy Policy</Link>, 
                which describes how we collect, use, and protect your personal and health information.
              </p>
              <p>
                We are HIPAA-compliant and implement industry-standard security measures to 
                protect your data.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">8. Disclaimers & Limitations</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p><strong>Service Availability:</strong></p>
              <p>
                The Service is provided "as is" without warranties of any kind. We do not 
                guarantee uninterrupted access or error-free operation.
              </p>
              <p className="mt-3"><strong>Medical Disclaimer:</strong></p>
              <p>
                medicom is a platform that connects patients with healthcare providers. 
                We do not practice medicine, provide medical advice, or guarantee treatment 
                outcomes. All medical decisions should be made in consultation with qualified 
                healthcare professionals.
              </p>
              <p className="mt-3"><strong>Limitation of Liability:</strong></p>
              <p>
                To the maximum extent permitted by law, medicom shall not be liable for 
                any indirect, incidental, special, or consequential damages arising from your 
                use of the Service, including medical malpractice claims against providers.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">9. Termination</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We may suspend or terminate your account if:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>You violate these Terms</li>
                <li>You engage in fraudulent or illegal activity</li>
                <li>Your account poses a security risk</li>
                <li>You request account deletion</li>
              </ul>
              <p className="mt-3">
                Upon termination, you will lose access to your account and associated data 
                (subject to legal retention requirements).
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">10. Changes to Terms</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of 
                material changes via email or platform notice. Continued use of the Service 
                after changes constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">11. Governing Law</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                These Terms are governed by the laws of the State of California, USA, without 
                regard to conflict of law principles. Any disputes shall be resolved in the 
                courts of San Francisco County, California.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">12. Contact Information</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>For questions about these Terms:</p>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-4 mt-3 space-y-2">
                <p><strong>Legal Department:</strong></p>
                <p>Email: <a href="mailto:legal@mediconnect.com" className="text-brand-600 hover:text-brand-700">legal@mediconnect.com</a></p>
                <p>Phone: <a href="tel:+1-555-MEDICAL" className="text-brand-600 hover:text-brand-700">1-555-MEDICAL</a></p>
                <p>Address: medicom, Inc., 123 Healthcare Blvd, Suite 500, San Francisco, CA 94102</p>
              </div>
            </div>
          </section>

          {/* Acceptance */}
          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500 italic">
              By using medicom, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
          <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
            Privacy Policy
          </Link>
          <Link href="/help" className="text-brand-600 hover:text-brand-700">
            Help Center
          </Link>
          <Link href="/dashboard" className="text-brand-600 hover:text-brand-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
