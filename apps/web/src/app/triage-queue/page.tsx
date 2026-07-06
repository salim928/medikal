"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Brain, Clock, CheckCircle, FileText, User, AlertCircle } from "lucide-react";
import { triageSeed, patients, type RiskLevel, type TriageStatus } from "@/lib/data";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

const riskHeader: Record<RiskLevel, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const riskLabel: Record<RiskLevel, string> = {
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
};

export default function TriageQueuePage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");
  const [statusById, setStatusById] = useState<Record<string, TriageStatus>>(
    () => Object.fromEntries(triageSeed.map((t) => [t.id, t.status]))
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    // Triage review is a clinician tool.
    if (!loading && isAuthenticated && role === "patient") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, role, router]);

  const submissions = useMemo(
    () => triageSeed.map((t) => ({ ...t, status: statusById[t.id] ?? t.status })),
    [statusById]
  );
  const pending = submissions.filter((s) => s.status === "pending");
  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.riskLevel === filter);

  const setStatus = (id: string, status: TriageStatus, message: string) => {
    setStatusById((m) => ({ ...m, [id]: status }));
    toast.success(message);
  };

  if (loading) return <PageSpinner />;
  if (role === "patient") return null;

  const countByRisk = (r: RiskLevel) => submissions.filter((s) => s.riskLevel === r).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-3 font-display text-4xl font-bold text-ink">
              <Brain className="h-10 w-10 text-brand-600" />
              AI triage queue
            </h1>
            <p className="text-lg text-slate-600">Review and approve AI-assisted symptom checker submissions</p>
          </div>
          <div className="hidden text-right md:block">
            <div className="text-3xl font-bold text-brand-600">{pending.length}</div>
            <div className="text-sm text-slate-500">Pending reviews</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-3">
          {([
            { id: "all", label: `All (${submissions.length})` },
            { id: "high", label: `High risk (${countByRisk("high")})` },
            { id: "medium", label: `Medium risk (${countByRisk("medium")})` },
            { id: "low", label: `Low risk (${countByRisk("low")})` },
          ] as const).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === f.id ? "bg-brand-600 text-white" : "bg-mist text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map((submission) => {
          const patient = patients.find((p) => p.name === submission.patientName);
          return (
            <div key={submission.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-brand-500/40">
              {/* Risk banner */}
              <div className={`border-b p-4 ${riskHeader[submission.riskLevel]}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-lg font-bold">{riskLabel[submission.riskLevel]}</span>
                    {submission.status !== "pending" && (
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold capitalize">
                        {submission.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {submission.submittedAt}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Patient info */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                        {submission.patientName[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-ink">{submission.patientName}</h3>
                        <p className="text-sm text-slate-500">{submission.patientEmail}</p>
                      </div>
                    </div>

                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
                      <FileText className="h-4 w-4" />
                      Reported symptoms
                    </h4>
                    <ul className="space-y-2">
                      {submission.symptoms.map((symptom) => (
                        <li key={symptom} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-1 text-brand-600">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI analysis */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
                        <Brain className="h-4 w-4" />
                        AI assessment
                      </h4>
                      <p className="font-medium text-ink">{submission.aiDiagnosis}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-brand-600">AI recommendations</h4>
                      <ul className="space-y-2">
                        {submission.aiRecommendations.map((rec) => (
                          <li key={rec} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1 text-brand-600">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {submission.status === "pending" ? (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                    <Button
                      onClick={() => setStatus(submission.id, "approved", `Recommendation approved for ${submission.patientName}`)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve recommendation
                    </Button>
                    <Button
                      onClick={() => setStatus(submission.id, "modified", `Marked as modified — follow up with ${submission.patientName}`)}
                      variant="outline"
                      className="flex items-center gap-2 border-blue-200 bg-blue-50 text-brand-700 hover:bg-blue-100"
                    >
                      <FileText className="h-4 w-4" />
                      Modify &amp; approve
                    </Button>
                    <Button
                      onClick={() => toast.info(`A secure message has been sent to ${submission.patientName}`)}
                      variant="outline"
                      className="flex items-center gap-2 border-slate-200 bg-mist text-slate-600 hover:bg-slate-200"
                    >
                      <User className="h-4 w-4" />
                      Contact patient
                    </Button>
                    {patient && (
                      <Button asChild variant="outline" className="border-slate-200 bg-mist text-slate-600 hover:bg-slate-200">
                        <Link href={`/patients/${patient.id}`}>View patient profile</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-500">
                    Review complete — status:{" "}
                    <span className="font-semibold capitalize text-ink">{submission.status}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <Brain className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <h3 className="mb-2 text-xl font-semibold text-ink">No submissions</h3>
          <p className="text-slate-500">
            No {filter !== "all" ? filter + " risk " : ""}triage submissions at this time.
          </p>
        </div>
      )}
    </div>
  );
}
