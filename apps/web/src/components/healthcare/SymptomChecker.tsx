"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Symptom {
  name: string;
  duration: string;
  severity: "mild" | "moderate" | "severe";
}

interface SymptomCheckerProps {
  onChange: (symptoms: Symptom[]) => void;
  value?: Symptom[];
}

const commonSymptoms = [
  "Fever",
  "Cough",
  "Sore throat",
  "Headache",
  "Body aches",
  "Fatigue",
  "Nausea",
  "Diarrhea",
  "Shortness of breath",
  "Chest pain",
];

export function SymptomChecker({ onChange, value }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>(value || []);
  const [customSymptom, setCustomSymptom] = useState("");

  const addSymptom = (name: string) => {
    const newSymptom: Symptom = {
      name,
      duration: "",
      severity: "mild",
    };
    const updated = [...symptoms, newSymptom];
    setSymptoms(updated);
    onChange(updated);
  };

  const removeSymptom = (index: number) => {
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
    onChange(updated);
  };

  const updateSymptom = (index: number, key: keyof Symptom, value: any) => {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], [key]: value };
    setSymptoms(updated);
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Symptoms</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common symptoms */}
        <div>
          <p className="text-sm font-medium mb-3">Common Symptoms</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonSymptoms.map((symptom) => (
              <Button
                key={symptom}
                variant={
                  symptoms.some((s) => s.name === symptom)
                    ? "default"
                    : "outline"
                }
                onClick={() => addSymptom(symptom)}
                className="justify-start"
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom symptom */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom symptom..."
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
          />
          <Button
            onClick={() => {
              if (customSymptom) {
                addSymptom(customSymptom);
                setCustomSymptom("");
              }
            }}
          >
            Add
          </Button>
        </div>

        {/* Selected symptoms */}
        {symptoms.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Selected Symptoms</p>
            {symptoms.map((symptom, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{symptom.name}</span>
                  <Button
                    variant="ghost"
                    onClick={() => removeSymptom(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Duration (e.g., 2 days)"
                    value={symptom.duration}
                    onChange={(e) =>
                      updateSymptom(idx, "duration", e.target.value)
                    }
                  />
                  <select
                    value={symptom.severity}
                    onChange={(e) =>
                      updateSymptom(idx, "severity", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}