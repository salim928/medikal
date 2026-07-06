"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";

export default function UploadRecordPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    recordType: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    // Uploading personal records is a patient action.
    if (!loading && isAuthenticated && role !== "patient") {
      router.push("/records");
    }
  }, [isAuthenticated, loading, role, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // TODO: Replace with actual API call
    // const formDataToSend = new FormData();
    // formDataToSend.append('file', selectedFile!);
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('recordType', formData.recordType);
    // formDataToSend.append('date', formData.date);
    // formDataToSend.append('description', formData.description);
    // 
    // const response = await fetch('/api/records/upload', {
    //   method: 'POST',
    //   body: formDataToSend,
    // });

    // Simulated upload (demo mode — no backend)
    await new Promise(resolve => setTimeout(resolve, 1200));

    setUploading(false);
    toast.success("Record uploaded");
    router.push("/records");
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <Upload className="w-8 h-8 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Upload Medical Record</h1>
            <p className="text-slate-600 mt-1">Add a new document to your health records</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-brand-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-ink mb-1">Supported file types:</p>
            <p>PDF, JPG, PNG, DICOM (max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-ink font-semibold mb-3">
            <FileText className="w-5 h-5 inline mr-2" />
            Select File *
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.dcm"
              className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand-600 file:text-white file:cursor-pointer hover:file:bg-brand-700"
              required
            />
          </div>
          {selectedFile && (
            <div className="mt-3 p-3 bg-brand-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600">Selected: {selectedFile.name}</span>
            </div>
          )}
        </div>

        {/* Record Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-4">Record Details</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-ink font-semibold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Blood Test Results - October 2025"
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            {/* Record Type */}
            <div>
              <label className="block text-ink font-semibold mb-2">Record Type *</label>
              <select
                value={formData.recordType}
                onChange={(e) => setFormData({...formData, recordType: e.target.value})}
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                required
              >
                <option value="">Select type...</option>
                <option value="Lab Results">Lab Results</option>
                <option value="X-Ray">X-Ray / Imaging</option>
                <option value="Prescription">Prescription</option>
                <option value="Consultation Notes">Consultation Notes</option>
                <option value="Vaccination Record">Vaccination Record</option>
                <option value="Surgery Report">Surgery Report</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-ink font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-ink font-semibold mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Add any additional notes or context..."
                rows={4}
                className="w-full px-4 py-3 bg-canvas border border-slate-200 rounded-lg text-ink placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-ink mb-1">Privacy & Security:</p>
              <p>Your medical records are encrypted and HIPAA compliant. Only you and authorized healthcare providers can access them.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={uploading || !selectedFile}
            className="flex-1 bg-brand-600 hover:bg-brand-700 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Record
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            disabled={uploading}
            className="bg-mist text-slate-700 hover:bg-slate-200 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
