"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

interface VitalSignsInputProps {
  onChange: (vitals: VitalSigns) => void;
  value?: Partial<VitalSigns>;
}

export function VitalSignsInput({ onChange, value }: VitalSignsInputProps) {
  const [vitals, setVitals] = useState<Partial<VitalSigns>>(value || {});

  const handleChange = (key: keyof VitalSigns, val: number) => {
    const updated = { ...vitals, [key]: val };
    setVitals(updated);
    onChange(updated as VitalSigns);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Vital Signs</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Systolic (mmHg)</label>
            <Input
              type="number"
              value={vitals.bloodPressureSystolic || ""}
              onChange={(e) =>
                handleChange("bloodPressureSystolic", parseInt(e.target.value))
              }
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Diastolic (mmHg)</label>
            <Input
              type="number"
              value={vitals.bloodPressureDiastolic || ""}
              onChange={(e) =>
                handleChange("bloodPressureDiastolic", parseInt(e.target.value))
              }
              placeholder="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
            <Input
              type="number"
              value={vitals.heartRate || ""}
              onChange={(e) => handleChange("heartRate", parseInt(e.target.value))}
              placeholder="72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
            <Input
              type="number"
              step="0.1"
              value={vitals.temperature || ""}
              onChange={(e) =>
                handleChange("temperature", parseFloat(e.target.value))
              }
              placeholder="98.6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Respiratory Rate (breaths/min)</label>
            <Input
              type="number"
              value={vitals.respiratoryRate || ""}
              onChange={(e) =>
                handleChange("respiratoryRate", parseInt(e.target.value))
              }
              placeholder="16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">O2 Saturation (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={vitals.oxygenSaturation || ""}
              onChange={(e) =>
                handleChange("oxygenSaturation", parseInt(e.target.value))
              }
              placeholder="98"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}