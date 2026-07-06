"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Upload, Download, Search, Plus, Eye } from "lucide-react";
import { medicalRecords, type RecordType } from "@/lib/data";

const filterTypes: { id: "all" | RecordType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Lab Results", label: "Lab Results" },
  { id: "Imaging", label: "Imaging" },
  { id: "Prescription", label: "Prescriptions" },
  { id: "Visit Note", label: "Notes" },
];

export default function RecordsPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const records = medicalRecords;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | RecordType>("all");

  const isProvider = role !== "patient";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.type === filterType);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) => r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [records, filterType, searchTerm]);

  const countByType = (type: RecordType) => records.filter((r) => r.type === type).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-brand-500" />
          <p className="text-slate-600">Loading records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-brand-500/10 to-brand-500/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">
                {isProvider ? "Patient medical records" : "My medical records"}
              </h1>
              <p className="mt-1 text-slate-600">
                {isProvider ? "Access and manage patient health records" : "View and manage your health records"}
              </p>
            </div>
          </div>
          {!isProvider && (
            <Button asChild className="bg-brand-600 hover:bg-brand-700">
              <Link href="/records/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload record
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isProvider && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total records", value: records.length },
            { label: "Lab results", value: countByType("Lab Results") },
            { label: "Imaging", value: countByType("Imaging") },
            { label: "Visit notes", value: countByType("Visit Note") },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-brand-600" />
                <div>
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search records…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-canvas py-2 pl-10 pr-4 text-ink placeholder-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterTypes.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  filterType === f.id ? "bg-brand-600 text-white" : "bg-mist text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <p className="mb-4 text-slate-500">No records found</p>
            {!isProvider && (
              <Button asChild className="bg-brand-600 hover:bg-brand-700">
                <Link href="/records/upload">Upload first record</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-brand-500/50">
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div className="rounded-lg border border-slate-200 bg-brand-50 p-3">
                    <FileText className="h-6 w-6 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink">{record.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {record.type} · {record.date}
                    </p>
                    {record.description && <p className="mt-2 text-slate-600">{record.description}</p>}
                  </div>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <Button asChild className="bg-brand-600 hover:bg-brand-700">
                    <Link href={`/records/${record.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  {isProvider && (
                    <Button asChild className="bg-brand-500 hover:bg-brand-600">
                      <Link href={`/records/${record.id}/notes`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add note
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
