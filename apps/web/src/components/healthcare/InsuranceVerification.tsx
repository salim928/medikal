"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface InsuranceInfo {
  memberId: string;
  groupNumber: string;
  planName: string;
  carrier: string;
  copay: number;
  deductible: number;
  deductibleMet: number;
  isActive: boolean;
  verificationDate: Date;
}

interface InsuranceVerificationProps {
  onVerify?: (insuranceInfo: InsuranceInfo) => void;
}

export function InsuranceVerification({ onVerify }: InsuranceVerificationProps) {
  const [memberId, setMemberId] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!memberId) {
      setError("Member ID is required");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Mock verification call
      const mockResult: InsuranceInfo = {
        memberId,
        groupNumber: groupNumber || "GROUP123",
        planName: "Blue Cross Blue Shield PPO",
        carrier: "BCBS",
        copay: 3000, // $30
        deductible: 150000, // $1500
        deductibleMet: 50000, // $500
        isActive: true,
        verificationDate: new Date(),
      };

      setInsuranceInfo(mockResult);
      onVerify?.(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Insurance Verification</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="123456789"
          />
          <Input
            label="Group Number (Optional)"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            placeholder="GROUP123"
          />
        </div>

        <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
          {isVerifying ? "Verifying..." : "Verify Insurance"}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {insuranceInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-700">
                {insuranceInfo.isActive ? "✓ Active" : "✕ Inactive"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Plan Name</p>
                <p className="font-medium">{insuranceInfo.planName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Carrier</p>
                <p className="font-medium">{insuranceInfo.carrier}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Copay</p>
                <p className="font-medium">
                  ${(insuranceInfo.copay / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Deductible</p>
                <p className="font-medium">
                  ${(insuranceInfo.deductible / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Deductible Met</p>
                <p className="font-medium">
                  ${(insuranceInfo.deductibleMet / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Remaining</p>
                <p className="font-medium">
                  ${((insuranceInfo.deductible - insuranceInfo.deductibleMet) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Verified: {insuranceInfo.verificationDate.toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}