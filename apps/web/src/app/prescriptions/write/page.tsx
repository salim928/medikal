"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pill, User, AlertTriangle, CheckCircle } from "lucide-react";
import { patients } from "@/lib/data";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

export default function WritePrescriptionPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [showInteractions, setShowInteractions] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: "0",
    pharmacy: "",
    notes: "",
  });

  // Mock drug interaction data
  const [interactions, setInteractions] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    // Only care providers can write prescriptions.
    if (!loading && isAuthenticated && role === "patient") {
      router.push("/prescriptions");
    }
  }, [isAuthenticated, loading, role, router]);

  const checkDrugInteractions = () => {
    setShowInteractions(true);
    // Mock drug interaction check
    if (formData.medication.toLowerCase().includes("warfarin")) {
      setInteractions([
        "⚠️ Interaction with Aspirin - Increased bleeding risk",
        "⚠️ Interaction with Ibuprofen - May reduce effectiveness",
      ]);
    } else if (formData.medication.toLowerCase().includes("metformin")) {
      setInteractions([
        "✓ No significant interactions detected",
      ]);
    } else {
      setInteractions([
        "✓ No interactions found with current medications",
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Prescription created — ready for e-signature");
    router.push("/prescriptions");
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center gap-3">
          <Pill className="w-8 h-8 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Write Prescription</h1>
            <p className="text-slate-600 mt-1">Create a new e-prescription for your patient</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">
            <User className="w-5 h-5 inline mr-2" />
            Select Patient
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
            required
          >
            <option value="">Choose a patient…</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.email}
              </option>
            ))}
          </select>
        </div>

        {/* Medication Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-4">Medication Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink font-semibold mb-2">Medication Name *</label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) => setFormData({...formData, medication: e.target.value})}
                placeholder="e.g., Amoxicillin"
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">Dosage *</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                placeholder="e.g., 500mg"
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">Frequency *</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                required
              >
                <option value="">Select frequency...</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="As needed">As needed</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 7 days"
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">Number of Refills</label>
              <select
                value={formData.refills}
                onChange={(e) => setFormData({...formData, refills: e.target.value})}
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              >
                <option value="0">No refills</option>
                <option value="1">1 refill</option>
                <option value="2">2 refills</option>
                <option value="3">3 refills</option>
                <option value="5">5 refills</option>
                <option value="11">11 refills (1 year)</option>
              </select>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-2">Preferred Pharmacy</label>
              <input
                type="text"
                value={formData.pharmacy}
                onChange={(e) => setFormData({...formData, pharmacy: e.target.value})}
                placeholder="Optional"
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">Patient Instructions *</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            placeholder="e.g., Take with food. Complete full course even if feeling better."
            rows={4}
            className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Clinical Notes */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">Clinical Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Private notes for your records..."
            rows={3}
            className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Drug Interaction Checker */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-ink">Drug Interaction Check</h2>
            <Button
              type="button"
              onClick={checkDrugInteractions}
              disabled={!formData.medication}
              className="bg-brand-500 hover:bg-brand-600"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Check Interactions
            </Button>
          </div>
          
          {showInteractions && (
            <div className="space-y-2">
              {interactions.map((interaction, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    interaction.includes('✓') 
                      ? 'bg-brand-500/20 border border-green-500/30 text-emerald-600'
                      : 'bg-yellow-500/20 border border-yellow-500/30 text-amber-600'
                  }`}
                >
                  {interaction}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1 bg-brand-500 hover:bg-brand-600 py-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            Create & Sign Prescription
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-mist text-slate-700 hover:bg-slate-200 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
