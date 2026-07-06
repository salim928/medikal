"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
}

interface DrugInteractionCheckerProps {
  medications: string[];
  allergies?: string[];
}

export function DrugInteractionChecker({
  medications,
  allergies = [],
}: DrugInteractionCheckerProps) {
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loading, setLoading] = useState(false);

  const checkInteractions = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/healthcare/drug-interactions", {
        medications,
        allergies,
      });
      setInteractions(response.data.interactions || []);
    } catch (error) {
      console.error("Failed to check interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Drug Interaction Checker</h3>
          <Button onClick={checkInteractions} disabled={loading || medications.length < 2}>
            {loading ? "Checking..." : "Check Interactions"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {interactions.length === 0 ? (
          <p className="text-gray-600 text-sm">No interactions detected</p>
        ) : (
          <div className="space-y-3">
            {interactions.map((interaction, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      {interaction.drug1} + {interaction.drug2}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                      interaction.severity
                    )}`}
                  >
                    {interaction.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{interaction.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}