"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppointments } from "@/hooks/useAppointments";

interface TriageReviewProps {
  appointmentId: string;
  triageResult: any;
}

export function TriageReview({ appointmentId, triageResult }: TriageReviewProps) {
  const [approved, setApproved] = useState(false);
  const { approveTriage, isApprovingTriage } = useAppointments();

  const handleApprove = () => {
    approveTriage(
      { id: appointmentId },
      {
        onSuccess: () => {
          setApproved(true);
          alert("Triage approved");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">AI Triage Assessment</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Risk Level
          </label>
          <div className={`mt-2 inline-block px-4 py-2 rounded-lg font-semibold ${
            triageResult.riskLevel === "critical"
              ? "bg-red-100 text-red-800"
              : triageResult.riskLevel === "high"
              ? "bg-orange-100 text-orange-800"
              : triageResult.riskLevel === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}>
            {triageResult.riskLevel?.toUpperCase()}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendations
          </label>
          <ul className="space-y-2">
            {triageResult.recommendations?.map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        {triageResult.redFlags && triageResult.redFlags.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <label className="block text-sm font-bold text-red-700 mb-2">
              ⚠️ Red Flags Detected
            </label>
            <ul className="space-y-1">
              {triageResult.redFlags.map((flag: string, idx: number) => (
                <li key={idx} className="text-sm text-red-600">• {flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {!approved && (
          <Button
            onClick={handleApprove}
            disabled={isApprovingTriage}
            className="w-full"
          >
            {isApprovingTriage ? "Approving..." : "Approve Assessment"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}