"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

export default function AddClinicalNotePage() {
  const { isAuthenticated, loading, role, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const toast = useToast();

  const [noteContent, setNoteContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    // Only care providers can add clinical notes.
    if (!loading && isAuthenticated && role === "patient") {
      router.push(`/records/${id}`);
    }
  }, [isAuthenticated, loading, role, router, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // TODO: Replace with actual API call
    // await fetch(`/api/records/${id}/notes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     content: noteContent,
    //     providerId: user?.id,
    //   }),
    // });

    // Simulated save (demo mode — no backend)
    await new Promise(resolve => setTimeout(resolve, 800));

    setSaving(false);
    toast.success("Clinical note saved");
    router.push(`/records/${id}`);
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Add Clinical Note</h1>
            <p className="text-slate-600 mt-1">Document your clinical observations and recommendations</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
        <p className="text-slate-600">
          <strong className="text-ink">Note:</strong> Clinical notes become part of the patient's permanent medical record and are visible to the patient.
        </p>
      </div>

      {/* Note Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">
            Clinical Note *
          </label>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Enter your clinical observations, findings, recommendations, and follow-up instructions..."
            rows={12}
            className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
            required
          />
          <p className="text-sm text-slate-500 mt-2">
            Be specific and objective. Include relevant findings, diagnoses, treatment plans, and follow-up instructions.
          </p>
        </div>

        {/* Template Suggestions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ink mb-3">Quick Templates</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => setNoteContent("Assessment: \n\nFindings: \n\nDiagnosis: \n\nTreatment Plan: \n\nFollow-up: ")}
              className="bg-mist text-slate-700 hover:bg-slate-200 text-left justify-start"
            >
              General Assessment
            </Button>
            <Button
              type="button"
              onClick={() => setNoteContent("Lab Results Review:\n\nKey Findings: \n\nInterpretation: \n\nRecommendations: ")}
              className="bg-mist text-slate-700 hover:bg-slate-200 text-left justify-start"
            >
              Lab Results Review
            </Button>
            <Button
              type="button"
              onClick={() => setNoteContent("Follow-up Visit:\n\nProgress: \n\nCurrent Status: \n\nNext Steps: ")}
              className="bg-mist text-slate-700 hover:bg-slate-200 text-left justify-start"
            >
              Follow-up Visit
            </Button>
            <Button
              type="button"
              onClick={() => setNoteContent("Treatment Response:\n\nSymptoms: \n\nMedication Review: \n\nAdjustments: ")}
              className="bg-mist text-slate-700 hover:bg-slate-200 text-left justify-start"
            >
              Treatment Response
            </Button>
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ink mb-3">Provider Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Provider Name</p>
              <p className="text-ink font-medium">
                {(user?.user_metadata?.full_name as string) || user?.email || "Provider"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date & Time</p>
              <p className="text-ink font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={saving || !noteContent.trim()}
            className="flex-1 bg-brand-500 hover:bg-brand-600 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Clinical Note
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={saving}
            className="bg-mist text-slate-700 hover:bg-slate-200 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
