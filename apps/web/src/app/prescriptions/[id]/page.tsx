"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Pill, Download, RefreshCw, User, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { getPrescription, type PrescriptionStatus } from "@/lib/data";
import { useToast } from "@/components/ui/toast";

const statusBadge: Record<PrescriptionStatus, string> = {
  active: "bg-green-50 text-green-600",
  completed: "bg-slate-100 text-slate-500",
  pending: "bg-yellow-50 text-yellow-600",
};

export default function PrescriptionDetailsPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const prescription = getPrescription(id);

  const isProvider = role !== "patient";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleDownload = () => toast.info("Prescription PDF download started (demo)");
  const handleRequestRefill = () => toast.success("Refill request sent to your doctor");

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-500" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-ink">Prescription not found</p>
        <button
          onClick={() => router.push("/prescriptions")}
          className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to prescriptions
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Pill className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">{prescription.medication}</h1>
              <p className="mt-1 text-slate-600">Prescription #{prescription.id}</p>
            </div>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusBadge[prescription.status]}`}>
            {prescription.status}
          </span>
        </div>
      </div>

      {/* Participant Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <User className="h-5 w-5 text-brand-600" />
            {isProvider ? "Patient" : "Prescribing doctor"}
          </h2>
          <p className="text-lg font-medium text-ink">
            {isProvider ? prescription.patient : prescription.doctor}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <Calendar className="h-5 w-5 text-brand-600" />
            Prescription date
          </h2>
          <p className="text-lg font-medium text-ink">{prescription.date}</p>
          {!isProvider && prescription.pharmacy && (
            <p className="mt-2 text-slate-500">Pharmacy: {prescription.pharmacy}</p>
          )}
        </div>
      </div>

      {/* Medication Details */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
          <Pill className="h-5 w-5 text-brand-600" />
          Medication details
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Dosage</p>
            <p className="text-lg font-medium text-ink">{prescription.dosage}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Frequency</p>
            <p className="text-lg font-medium text-ink">{prescription.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Duration</p>
            <p className="text-lg font-medium text-ink">{prescription.duration}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Refills</p>
            <p className="text-lg font-medium text-ink">
              {prescription.refills} of {prescription.totalRefills} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
          <FileText className="h-5 w-5 text-brand-600" />
          Instructions
        </h2>
        <p className="mb-4 text-slate-600">{prescription.instructions}</p>
        {prescription.prescribedFor && (
          <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50 p-3">
            <p className="text-sm text-slate-500">Prescribed for:</p>
            <p className="text-ink">{prescription.prescribedFor}</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {prescription.warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-yellow-700">⚠️ Important warnings</h2>
          <ul className="space-y-2">
            {prescription.warnings.map((warning) => (
              <li key={warning} className="flex items-start gap-2 text-slate-600">
                <span className="text-yellow-600">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Side Effects */}
      {prescription.sideEffects.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-ink">Possible side effects</h2>
          <div className="flex flex-wrap gap-2">
            {prescription.sideEffects.map((effect) => (
              <span key={effect} className="rounded-full border border-slate-200 bg-mist px-3 py-1 text-sm text-slate-600">
                {effect}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Contact your doctor if you experience severe or persistent side effects.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-ink">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} className="bg-brand-500 hover:bg-brand-600">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          {!isProvider && prescription.status === "active" && prescription.refills > 0 && (
            <Button onClick={handleRequestRefill} className="bg-brand-500 hover:bg-brand-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Request refill
            </Button>
          )}

          {isProvider && (
            <Button asChild className="bg-brand-500 hover:bg-brand-600">
              <Link href="/prescriptions/write">Write new prescription</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-center">
        <Button onClick={() => router.push("/prescriptions")} className="bg-mist text-slate-700 hover:bg-slate-200">
          Back to prescriptions
        </Button>
      </div>
    </div>
  );
}
