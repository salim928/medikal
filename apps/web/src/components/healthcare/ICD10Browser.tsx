"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  notes?: string;
}

const icd10Database: ICD10Code[] = [
  {
    code: "E11.9",
    description: "Type 2 diabetes mellitus without complications",
    category: "Endocrine",
    notes: "Most common diabetes diagnosis",
  },
  {
    code: "I10",
    description: "Essential (primary) hypertension",
    category: "Cardiovascular",
    notes: "No complications",
  },
  {
    code: "J06.9",
    description: "Acute upper respiratory infection",
    category: "Respiratory",
    notes: "Unspecified",
  },
  {
    code: "M79.3",
    description: "Panniculitis",
    category: "Musculoskeletal",
    notes: "Includes lipedema",
  },
  {
    code: "F41.1",
    description: "Generalized anxiety disorder",
    category: "Mental Health",
    notes: "With panic attacks",
  },
];

interface ICD10BrowserProps {
  onSelectCode: (code: ICD10Code) => void;
  selectedCodes?: string[];
}

export function ICD10Browser({
  onSelectCode,
  selectedCodes = [],
}: ICD10BrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCodes = icd10Database.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(icd10Database.map((item) => item.category))];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">ICD-10 Code Browser</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCodes.map((code) => (
            <div
              key={code.code}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectCode(code)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-mono font-semibold text-brand-600">
                    {code.code}
                  </p>
                  <p className="text-sm text-gray-700">{code.description}</p>
                  {code.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 {code.notes}
                    </p>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code.code)}
                  onChange={() => {}}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}