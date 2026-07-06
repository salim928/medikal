"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface DrugInfo {
  name: string;
  manufacturer: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  fdaRegistration: string;
  status: 'Authentic' | 'Counterfeit' | 'Not Found';
  warnings?: string[];
}

export default function VerifyDrugPage() {
  const [verificationMode, setVerificationMode] = useState<'qr' | 'batch'>('batch');
  const [batchNumber, setBatchNumber] = useState('');
  const [drugResult, setDrugResult] = useState<DrugInfo | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock FDA database verification
  const verifyDrug = (batch: string) => {
    setIsVerifying(true);
    
    // Simulate API call to FDA database
    setTimeout(() => {
      const mockDatabase: Record<string, DrugInfo> = {
        'FDA-AMX-2024-001': {
          name: 'Amoxicillin 500mg Capsules',
          manufacturer: 'Danadams Pharmaceutical Industry Ltd',
          batchNumber: 'FDA-AMX-2024-001',
          manufactureDate: '2024-01-15',
          expiryDate: '2026-01-14',
          fdaRegistration: 'FDA-GH-2024-A123',
          status: 'Authentic',
        },
        'FDA-IBU-2023-045': {
          name: 'Ibuprofen 400mg Tablets',
          manufacturer: 'Ernest Chemists Ltd',
          batchNumber: 'FDA-IBU-2023-045',
          manufactureDate: '2023-06-20',
          expiryDate: '2025-06-19',
          fdaRegistration: 'FDA-GH-2023-B456',
          status: 'Authentic',
        },
        'FAKE-123-456': {
          name: 'Unknown Product',
          manufacturer: 'Unregistered Manufacturer',
          batchNumber: 'FAKE-123-456',
          manufactureDate: 'Unknown',
          expiryDate: 'Unknown',
          fdaRegistration: 'Not Registered',
          status: 'Counterfeit',
          warnings: ['This product is not registered with Ghana FDA', 'May contain harmful substances', 'Do not consume']
        }
      };

      const result = mockDatabase[batch] || {
        name: 'Product Not Found',
        manufacturer: 'Unknown',
        batchNumber: batch,
        manufactureDate: 'Unknown',
        expiryDate: 'Unknown',
        fdaRegistration: 'Not Found',
        status: 'Not Found' as const,
        warnings: ['This batch number is not found in FDA database', 'Please verify the code and try again']
      };

      setDrugResult(result);
      setIsVerifying(false);
    }, 2000);
  };

  const handleVerify = () => {
    if (batchNumber.trim()) {
      verifyDrug(batchNumber);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Authentic':
        return 'bg-brand-500/20 text-green-400 border-green-500/50';
      case 'Counterfeit':
        return 'bg-red-500/20 text-red-600 border-red-500/50';
      case 'Not Found':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink mb-2">Drug Authentication</h1>
          <p className="text-slate-500">Verify medication authenticity using FDA database</p>
        </div>

        {/* Verification Mode Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setVerificationMode('batch')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              verificationMode === 'batch'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-brand-500/50'
            }`}
          >
            Batch Number
          </button>
          <button
            onClick={() => setVerificationMode('qr')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              verificationMode === 'qr'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-brand-500/50'
            }`}
          >
            QR Code Scan
          </button>
        </div>

        {/* Batch Number Input */}
        {verificationMode === 'batch' && (
          <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Enter Batch Number</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g., FDA-AMX-2024-001"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500/50"
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying || !batchNumber.trim()}
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:from-brand-600 disabled:to-brand-500 text-white font-semibold rounded-lg transition"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-3">
              Find the batch number on the medication packaging, usually near the expiry date.
            </p>
          </div>
        )}

        {/* QR Scanner */}
        {verificationMode === 'qr' && (
          <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Scan QR Code</h3>
            <div className="aspect-square max-w-md mx-auto bg-white/80 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-slate-500 mb-4">Camera access required</p>
                <button className="px-6 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-lg transition">
                  Enable Camera
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-3 text-center">
              Position the QR code within the frame to scan
            </p>
          </div>
        )}

        {/* Verification Result */}
        {drugResult && (
          <div className={`bg-white backdrop-blur border rounded-lg p-6 mb-6 ${
            drugResult.status === 'Authentic' ? 'border-green-500/50' :
            drugResult.status === 'Counterfeit' ? 'border-red-500/50' :
            'border-yellow-500/50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-ink">Verification Result</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(drugResult.status)}`}>
                {drugResult.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-sm mb-1">Product Name</p>
                  <p className="text-ink font-semibold">{drugResult.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Manufacturer</p>
                  <p className="text-ink font-semibold">{drugResult.manufacturer}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Batch Number</p>
                  <p className="text-ink font-semibold">{drugResult.batchNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">FDA Registration</p>
                  <p className="text-ink font-semibold">{drugResult.fdaRegistration}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Manufacture Date</p>
                  <p className="text-ink font-semibold">{drugResult.manufactureDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Expiry Date</p>
                  <p className="text-ink font-semibold">{drugResult.expiryDate}</p>
                </div>
              </div>

              {drugResult.warnings && drugResult.warnings.length > 0 && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-600 font-semibold mb-2">⚠️ Warnings:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {drugResult.warnings.map((warning, index) => (
                      <li key={index} className="text-red-300 text-sm">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {drugResult.status === 'Authentic' && (
                <div className="mt-6 p-4 bg-brand-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold mb-2">✓ Verified Authentic</p>
                  <p className="text-green-300 text-sm">
                    This medication is registered with Ghana FDA and manufactured by a licensed facility.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sample Batch Numbers */}
        <div className="bg-brand-50 border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-600 mb-3">Try Sample Verification</h3>
          <p className="text-slate-600 text-sm mb-4">Test with these batch numbers:</p>
          <div className="grid md:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setBatchNumber('FDA-AMX-2024-001');
                verifyDrug('FDA-AMX-2024-001');
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-brand-500/50 text-brand-600 rounded-lg text-sm font-mono transition"
            >
              FDA-AMX-2024-001
            </button>
            <button
              onClick={() => {
                setBatchNumber('FDA-IBU-2023-045');
                verifyDrug('FDA-IBU-2023-045');
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-brand-500/50 text-brand-600 rounded-lg text-sm font-mono transition"
            >
              FDA-IBU-2023-045
            </button>
            <button
              onClick={() => {
                setBatchNumber('FAKE-123-456');
                verifyDrug('FAKE-123-456');
              }}
              className="px-4 py-2 bg-white border border-red-500/20 hover:border-red-500/50 text-red-600 rounded-lg text-sm font-mono transition"
            >
              FAKE-123-456 (Fake)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
