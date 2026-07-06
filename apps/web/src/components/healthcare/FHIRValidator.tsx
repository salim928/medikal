"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface FHIRValidatorProps {
  onValidate?: (result: ValidationResult) => void;
}

export function FHIRValidator({ onValidate }: FHIRValidatorProps) {
  const [fhirJson, setFhirJson] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(
    null
  );
  const [isValidating, setIsValidating] = useState(false);

  const validateFHIR = async () => {
    setIsValidating(true);
    try {
      const result = performValidation(fhirJson);
      setValidationResult(result);
      onValidate?.(result);
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [error instanceof Error ? error.message : "Validation failed"],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const performValidation = (json: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const parsed = JSON.parse(json);

      // Check required FHIR fields
      if (!parsed.resourceType) {
        errors.push("Missing required field: resourceType");
      }

      if (!parsed.id) {
        warnings.push("Missing recommended field: id");
      }

      // Validate by resource type
      if (parsed.resourceType === "Patient") {
        if (!parsed.name || parsed.name.length === 0) {
          errors.push("Patient must have at least one name");
        }
      } else if (parsed.resourceType === "Observation") {
        if (!parsed.code) {
          errors.push("Observation must have a code");
        }
        if (!parsed.value) {
          errors.push("Observation must have a value");
        }
      } else if (parsed.resourceType === "Medication") {
        if (!parsed.code) {
          warnings.push("Medication should have a code");
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        valid: false,
        errors: ["Invalid JSON format"],
        warnings: [],
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">FHIR JSON Validator</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">FHIR JSON</label>
          <textarea
            value={fhirJson}
            onChange={(e) => setFhirJson(e.target.value)}
            className="w-full h-48 p-2 border rounded-lg font-mono text-sm"
            placeholder='{"resourceType": "Patient", ...}'
          />
        </div>

        <Button onClick={validateFHIR} disabled={isValidating}>
          {isValidating ? "Validating..." : "Validate"}
        </Button>

        {validationResult && (
          <div className="space-y-3">
            {validationResult.valid ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  ✓ Valid FHIR resource
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  ✕ Invalid FHIR resource
                </AlertDescription>
              </Alert>
            )}

            {validationResult.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800 mb-2">Errors:</p>
                <ul className="space-y-1">
                  {validationResult.errors.map((error, i) => (
                    <li key={i} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Warnings:</p>
                <ul className="space-y-1">
                  {validationResult.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}