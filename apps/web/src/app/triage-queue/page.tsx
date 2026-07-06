"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Clock, User, FileText, CheckCircle, XCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface TriageSubmission {
  id: string;
  patientName: string;
  patientEmail: string;
  submittedAt: string;
  symptoms: string[];
  riskLevel: "high" | "medium" | "low";
  aiDiagnosis: string;
  aiRecommendations: string[];
  status: "pending" | "approved" | "modified" | "rejected";
}

export default function TriageQueuePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [selectedSubmission, setSelectedSubmission] = useState<TriageSubmission | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
    
    // Redirect non-providers
    if (!loading && user && user.role !== "provider" && user.role !== "doctor") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading triage queue...</p>
        </div>
      </div>
    );
  }

  // Mock triage submissions
  const submissions: TriageSubmission[] = [
    {
      id: "1",
      patientName: "Emily Rodriguez",
      patientEmail: "emily.r@email.com",
      submittedAt: "2025-01-17 09:30 AM",
      symptoms: ["High fever (102°F)", "Severe headache", "Body aches", "Fatigue"],
      riskLevel: "high",
      aiDiagnosis: "Likely Influenza (Flu)",
      aiRecommendations: [
        "Urgent consultation recommended within 24 hours",
        "Rest and hydration",
        "Consider antiviral medication (Tamiflu) if within 48 hours of symptom onset",
        "Monitor temperature regularly",
        "Seek emergency care if fever exceeds 104°F or difficulty breathing"
      ],
      status: "pending"
    },
    {
      id: "2",
      patientName: "Robert Chen",
      patientEmail: "robert.chen@email.com",
      submittedAt: "2025-01-17 08:15 AM",
      symptoms: ["Mild cough", "Runny nose", "Sneezing", "Sore throat"],
      riskLevel: "low",
      aiDiagnosis: "Common Cold (Upper Respiratory Infection)",
      aiRecommendations: [
        "Rest and fluids",
        "Over-the-counter cold medications",
        "Honey and warm liquids for throat",
        "Should resolve in 7-10 days",
        "Consult doctor if symptoms worsen or persist beyond 10 days"
      ],
      status: "pending"
    },
    {
      id: "3",
      patientName: "Lisa Anderson",
      patientEmail: "lisa.a@email.com",
      submittedAt: "2025-01-17 07:45 AM",
      symptoms: ["Chest pain", "Shortness of breath", "Dizziness", "Nausea"],
      riskLevel: "high",
      aiDiagnosis: "Possible Cardiac Event - URGENT",
      aiRecommendations: [
        "SEEK IMMEDIATE EMERGENCY CARE (Call 911)",
        "Do not drive yourself - call ambulance",
        "This requires immediate medical attention",
        "Chew aspirin if available and not allergic",
        "Stay calm and rest until help arrives"
      ],
      status: "pending"
    },
    {
      id: "4",
      patientName: "James Wilson",
      patientEmail: "james.w@email.com",
      submittedAt: "2025-01-17 06:20 AM",
      symptoms: ["Back pain", "Stiffness", "Discomfort when sitting"],
      riskLevel: "medium",
      aiDiagnosis: "Muscle Strain or Lower Back Pain",
      aiRecommendations: [
        "Consultation recommended within 3-5 days",
        "Apply ice for first 48 hours, then heat",
        "Over-the-counter pain relievers (ibuprofen, acetaminophen)",
        "Gentle stretching exercises",
        "Avoid heavy lifting"
      ],
      status: "pending"
    }
  ];

  const filteredSubmissions = filter === "all" 
    ? submissions 
    : submissions.filter(s => s.riskLevel === filter);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-500/20 border-red-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low": return "text-green-400 bg-brand-500/20 border-green-500/30";
      default: return "text-slate-500 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high": return "🔴 HIGH RISK";
      case "medium": return "🟡 MEDIUM RISK";
      case "low": return "🟢 LOW RISK";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-8 border border-slate-200 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-ink mb-2 flex items-center gap-3">
              <Brain className="w-10 h-10 text-brand-600" />
              AI Triage Queue
            </h1>
            <p className="text-slate-600 text-lg">
              Review and approve AI-powered symptom checker submissions
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-600">{submissions.length}</div>
              <div className="text-sm text-slate-500">Pending Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-brand-600 hover:bg-brand-700" : "bg-mist border-slate-200 text-slate-600 hover:bg-slate-200"}
          >
            All ({submissions.length})
          </Button>
          <Button
            variant={filter === "high" ? "default" : "outline"}
            onClick={() => setFilter("high")}
            className={filter === "high" ? "bg-red-500 hover:bg-red-600" : "bg-mist border-slate-200 text-slate-600 hover:bg-slate-200"}
          >
            🔴 High Risk ({submissions.filter(s => s.riskLevel === "high").length})
          </Button>
          <Button
            variant={filter === "medium" ? "default" : "outline"}
            onClick={() => setFilter("medium")}
            className={filter === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-mist border-slate-200 text-slate-600 hover:bg-slate-200"}
          >
            🟡 Medium Risk ({submissions.filter(s => s.riskLevel === "medium").length})
          </Button>
          <Button
            variant={filter === "low" ? "default" : "outline"}
            onClick={() => setFilter("low")}
            className={filter === "low" ? "bg-brand-500 hover:bg-brand-600" : "bg-mist border-slate-200 text-slate-600 hover:bg-slate-200"}
          >
            🟢 Low Risk ({submissions.filter(s => s.riskLevel === "low").length})
          </Button>
        </div>
      </div>

      {/* Triage Submissions */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-white backdrop-blur border border-slate-200 rounded-lg overflow-hidden hover:border-brand-500/40 transition">
            {/* Header */}
            <div className={`p-4 border-b border-slate-200 ${getRiskColor(submission.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-bold text-lg">{getRiskBadge(submission.riskLevel)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {submission.submittedAt}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {submission.patientName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink text-lg">{submission.patientName}</h3>
                      <p className="text-sm text-slate-500">{submission.patientEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-brand-600 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Reported Symptoms
                      </h4>
                      <ul className="space-y-2">
                        {submission.symptoms.map((symptom, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-brand-600 mt-1">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-brand-600 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Diagnosis
                      </h4>
                      <p className="text-ink font-medium">{submission.aiDiagnosis}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-brand-600 mb-2">AI Recommendations</h4>
                      <ul className="space-y-2">
                        {submission.aiRecommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-brand-600 mt-1">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200">
                <Button className="bg-brand-500 hover:bg-brand-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approve AI Recommendation
                </Button>
                <Button variant="outline" className="bg-brand-500/10 border-blue-500/30 text-brand-600 hover:bg-brand-500/20 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Modify & Approve
                </Button>
                <Button variant="outline" className="bg-brand-50 border-slate-200 text-brand-600 hover:bg-brand-600/20 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Patient
                </Button>
                <Link href={`/patients`}>
                  <Button variant="outline" className="bg-mist border-slate-200 text-slate-600 hover:bg-slate-200">
                    View Patient Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-12 text-center">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-ink mb-2">No Submissions</h3>
          <p className="text-slate-500">
            No {filter !== "all" ? filter + " risk " : ""}triage submissions at this time.
          </p>
        </div>
      )}
    </div>
  );
}
