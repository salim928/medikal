"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { RoleSelector, type UserRole } from "@/components/auth/RoleSelector";
import { PatientRegistrationForm } from "@/components/auth/PatientRegistrationForm";
import { DoctorRegistrationForm } from "@/components/auth/DoctorRegistrationForm";
import { NurseRegistrationForm } from "@/components/auth/NurseRegistrationForm";
import { MidwifeRegistrationForm } from "@/components/auth/MidwifeRegistrationForm";
import { LawyerRegistrationForm } from "@/components/auth/LawyerRegistrationForm";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={setSelectedRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BrandMark className="h-4 w-4" />
            </span>
            <span className="font-display font-semibold text-slate-900">medicom</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Already have an account? <span className="text-brand-600">Sign in</span>
          </Link>
        </div>
      </header>

      <div className="container flex flex-col items-center py-12">
        <button
          onClick={() => setSelectedRole(null)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to role selection
        </button>

        {selectedRole === "patient" && <PatientRegistrationForm />}
        {selectedRole === "doctor" && <DoctorRegistrationForm />}
        {selectedRole === "nurse" && <NurseRegistrationForm />}
        {selectedRole === "midwife" && <MidwifeRegistrationForm />}
        {selectedRole === "lawyer" && <LawyerRegistrationForm />}
      </div>
    </div>
  );
}
