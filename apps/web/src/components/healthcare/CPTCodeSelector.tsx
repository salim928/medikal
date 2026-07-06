"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface CPTCode {
  code: string;
  description: string;
  category: string;
  price: number;
}

const cptDatabase: CPTCode[] = [
  {
    code: "99213",
    description: "Office visit - established patient, low complexity",
    category: "Office Visits",
    price: 10000, // $100
  },
  {
    code: "99214",
    description: "Office visit - established patient, moderate complexity",
    category: "Office Visits",
    price: 15000, // $150
  },
  {
    code: "99215",
    description: "Office visit - established patient, high complexity",
    category: "Office Visits",
    price: 20000, // $200
  },
  {
    code: "99285",
    description: "Emergency department visit - high complexity",
    category: "Emergency",
    price: 50000,
  },
  {
    code: "80053",
    description: "Comprehensive metabolic panel",
    category: "Lab",
    price: 5000,
  },
];

interface CPTCodeSelectorProps {
  onSelectCode: (code: CPTCode) => void;
  selectedCodes?: string[];
}

export function CPTCodeSelector({
  onSelectCode,
  selectedCodes = [],
}: CPTCodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCodes = cptDatabase.filter(
    (item) =>
      item.code.includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">CPT Code Selector</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search CPT code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCodes.map((code) => (
            <div
              key={code.code}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectCode(code)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-brand-600">
                      {code.code}
                    </p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {code.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {code.description}
                  </p>
                  <p className="text-sm font-semibold text-green-600 mt-2">
                    ${(code.price / 100).toFixed(2)}
                  </p>
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