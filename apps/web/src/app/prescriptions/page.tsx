"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Pill, Plus, Search, FileText, Download, RefreshCw, AlertCircle } from "lucide-react";
import { prescriptions, type PrescriptionStatus } from "@/lib/data";

const statuses: { id: "all" | PrescriptionStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

const statusColor: Record<PrescriptionStatus, string> = {
  active: "bg-green-50 text-green-600 border-green-500/30",
  completed: "bg-slate-100 text-slate-500 border-slate-300",
  pending: "bg-yellow-50 text-yellow-600 border-yellow-500/30",
};

export default function PrescriptionsPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"all" | PrescriptionStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const isProvider = role !== "patient";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const filtered = useMemo(() => {
    return prescriptions.filter((p) => {
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        p.medication.toLowerCase().includes(q) ||
        (isProvider ? p.patient : p.doctor).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchTerm, isProvider]);

  const countByStatus = (s: PrescriptionStatus) => prescriptions.filter((p) => p.status === s).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-brand-500" />
          <p className="text-slate-600">Loading prescriptions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">
                {isProvider ? "Patient prescriptions" : "My prescriptions"}
              </h1>
              <p className="mt-1 text-slate-600">
                {isProvider ? "Write and manage patient prescriptions" : "View and manage your prescriptions"}
              </p>
            </div>
          </div>
          {isProvider && (
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href="/prescriptions/write">
                <Plus className="mr-2 h-4 w-4" />
                Write prescription
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isProvider && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-green-500/30 bg-white p-4">
            <div className="flex items-center gap-3">
              <Pill className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-ink">{countByStatus("active")}</p>
                <p className="text-sm text-slate-500">Active prescriptions</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-yellow-500/30 bg-white p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-ink">{countByStatus("pending")}</p>
                <p className="text-sm text-slate-500">Pending approval</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-white p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-brand-600" />
              <div>
                <p className="text-2xl font-bold text-ink">{countByStatus("completed")}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isProvider ? "Search by medication or patient…" : "Search medications…"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-canvas py-2 pl-10 pr-4 text-ink placeholder-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setFilterStatus(s.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  filterStatus === s.id ? "bg-brand-600 text-white" : "bg-mist text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <Pill className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <p className="mb-4 text-slate-500">No prescriptions found</p>
            {isProvider && (
              <Button asChild className="bg-brand-600 hover:bg-brand-700">
                <Link href="/prescriptions/write">Write first prescription</Link>
              </Button>
            )}
          </div>
        ) : (
          filtered.map((prescription) => (
            <div
              key={prescription.id}
              className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-brand-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <Pill className="h-6 w-6 text-brand-600" />
                    <h3 className="text-xl font-semibold text-ink">{prescription.medication}</h3>
                    <span className={`rounded-full border px-3 py-1 text-sm capitalize ${statusColor[prescription.status]}`}>
                      {prescription.status}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-4 text-slate-600 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-slate-500">{isProvider ? "Patient" : "Doctor"}</p>
                      <p className="font-medium">{isProvider ? prescription.patient : prescription.doctor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Dosage</p>
                      <p className="font-medium">{prescription.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Duration</p>
                      <p className="font-medium">{prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium">{prescription.date}</p>
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg bg-mist p-3">
                    <p className="text-sm text-slate-500">Instructions:</p>
                    <p className="text-slate-600">{prescription.instructions}</p>
                  </div>

                  {!isProvider && prescription.pharmacy && (
                    <p className="text-sm text-slate-500">
                      Pharmacy: <span className="text-slate-600">{prescription.pharmacy}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-500">
                    Refills remaining: <span className="text-slate-600">{prescription.refills}</span>
                  </p>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href={`/prescriptions/${prescription.id}`}>View details</Link>
                  </Button>

                  {!isProvider && prescription.status === "active" && prescription.refills > 0 && (
                    <Button className="bg-brand-500 hover:bg-brand-600">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request refill
                    </Button>
                  )}

                  <Button className="bg-brand-500 hover:bg-brand-600">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
