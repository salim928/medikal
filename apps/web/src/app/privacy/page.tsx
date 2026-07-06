"use client";

import Link from "next/link";
import { Shield, Lock, Eye, FileText, Users, Database, Globe, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-1">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12 text-brand-600" />
            <div>
              <h1 className="text-4xl font-bold text-ink">Privacy Policy</h1>
              <p className="text-slate-600 mt-2">Last Updated: October 17, 2025</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Your privacy and the security of your health information is our top priority.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">1. Information We Collect</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth</li>
                <li><strong>Health Information:</strong> Medical history, prescriptions, test results, consultation notes</li>
                <li><strong>Account Information:</strong> Username, password (encrypted), preferences</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
                <li><strong>Communication Data:</strong> Messages, video consultations, support requests</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">2. How We Use Your Information</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Provide healthcare services and facilitate medical consultations</li>
                <li>Maintain and improve our platform and services</li>
                <li>Process appointments, prescriptions, and payments</li>
                <li>Communicate with you about your care and account</li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Comply with legal obligations and healthcare regulations</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">3. HIPAA Compliance</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                medicom is fully compliant with the Health Insurance Portability and 
                Accountability Act (HIPAA). We implement strict safeguards to protect your 
                Protected Health Information (PHI):
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can view PHI</li>
                <li><strong>Audit Logs:</strong> All access to PHI is logged and monitored</li>
                <li><strong>Business Associate Agreements:</strong> All third-party vendors sign BAAs</li>
                <li><strong>Training:</strong> Staff receives regular HIPAA compliance training</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">4. Information Sharing</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Healthcare Providers:</strong> Doctors and medical staff involved in your care</li>
                <li><strong>Insurance Companies:</strong> For billing and claims processing (with consent)</li>
                <li><strong>Pharmacies:</strong> To fulfill prescriptions (with consent)</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect safety</li>
                <li><strong>Service Providers:</strong> Third parties that help operate our platform (under strict agreements)</li>
              </ul>
              <p className="mt-3">
                We <strong>never</strong> sell your personal or health information to third parties.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">5. Your Privacy Rights</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Access:</strong> Request a copy of your health information</li>
                <li><strong>Correction:</strong> Request corrections to inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Restriction:</strong> Request limits on how we use your information</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-Out:</strong> Decline marketing communications or data sharing</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, visit your <Link href="/settings/privacy" className="text-brand-600 hover:text-brand-700">Privacy Settings</Link> or contact us.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">6. Data Retention</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We retain your information:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Active Accounts:</strong> While your account is active and for healthcare continuity</li>
                <li><strong>Medical Records:</strong> As required by law (typically 7-10 years)</li>
                <li><strong>Deleted Accounts:</strong> 30-day grace period, then permanent deletion</li>
                <li><strong>Legal Requirements:</strong> Longer retention if required by regulation or litigation</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">7. Security Measures</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>We protect your information through:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>End-to-end encryption for video consultations</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication (2FA) options</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Employee background checks and training</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">8. Contact Us</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>For privacy-related questions or concerns:</p>
              <div className="bg-white/80 border border-slate-200 rounded-lg p-4 mt-3 space-y-2">
                <p><strong>Privacy Officer:</strong></p>
                <p>Email: <a href="mailto:privacy@mediconnect.com" className="text-brand-600 hover:text-brand-700">privacy@mediconnect.com</a></p>
                <p>Phone: <a href="tel:+1-555-PRIVACY" className="text-brand-600 hover:text-brand-700">1-555-PRIVACY</a></p>
                <p>Address: medicom Privacy Office, 123 Healthcare Blvd, Suite 500, San Francisco, CA 94102</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-ink">9. Changes to This Policy</h2>
            </div>
            <div className="text-slate-600 space-y-3 pl-9">
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant 
                changes via email or through a notice on our platform. Your continued use of 
                medicom after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500 italic">
              By using medicom, you acknowledge that you have read and understood this 
              Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
          <Link href="/terms" className="text-brand-600 hover:text-brand-700">
            Terms of Service
          </Link>
          <Link href="/help" className="text-brand-600 hover:text-brand-700">
            Help Center
          </Link>
          <Link href="/settings/privacy" className="text-brand-600 hover:text-brand-700">
            Privacy Settings
          </Link>
          <Link href="/dashboard" className="text-brand-600 hover:text-brand-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
