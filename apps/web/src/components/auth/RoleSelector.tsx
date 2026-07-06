"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Stethoscope, Heart, Baby, Scale, Check, ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export type UserRole = "patient" | "doctor" | "nurse" | "midwife" | "lawyer";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleOptions: RoleOption[] = [
  { value: "patient", label: "Patient", description: "Book visits, manage records, and consult providers.", icon: User },
  { value: "doctor", label: "Doctor", description: "Run consultations, manage appointments, prescribe.", icon: Stethoscope },
  { value: "nurse", label: "Nurse", description: "Support patient care and coordinate treatment.", icon: Heart },
  { value: "midwife", label: "Midwife", description: "Provide prenatal, birth, and postpartum care.", icon: Baby },
  { value: "lawyer", label: "Healthcare Lawyer", description: "Advise on medical cases, rights, and health law.", icon: Scale },
];

export function RoleSelector({ onRoleSelect }: { onRoleSelect: (role: UserRole) => void }) {
  const [selected, setSelected] = useState<UserRole | null>(null);

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

      <div className="container max-w-4xl py-14">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-3 text-lg text-slate-600">Tell us how you&apos;ll use medicom.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleOptions.map((role) => {
            const isSelected = selected === role.value;
            const Icon = role.icon;
            return (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                aria-pressed={isSelected}
                className={`relative rounded-2xl border bg-white p-6 text-left shadow-card transition ${
                  isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
                }`}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                    isSelected ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{role.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{role.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => selected && onRoleSelect(selected)}
            disabled={!selected}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue{selected ? ` as ${roleOptions.find((r) => r.value === selected)?.label}` : ""}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
