"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Eye, User, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { getMedicalRecord } from "@/lib/data";
import { useToast } from "@/components/ui/toast";

export default function RecordViewerPage() {
  const { isAuthenticated, loading, role } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const record = getMedicalRecord(id);

  const isProvider = role !== "patient";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleDownload = () => toast.info("Download started (demo)");
  const handleShare = () => toast.success("Record shared with your care team");
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      toast.success("Record deleted");
      router.push("/records");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-ink">Record not found</p>
        <button
          onClick={() => router.push("/records")}
          className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Back to records
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-brand-600" />
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">{record.title}</h1>
              <p className="mt-1 text-slate-600">
                {record.type} · {record.date}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="bg-brand-500 hover:bg-brand-600">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {!isProvider && (
              <Button onClick={handleShare} className="bg-brand-500 hover:bg-brand-600">
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Record Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <User className="h-5 w-5 text-brand-600" />
            Record information
          </h2>
          <div className="space-y-3">
            {isProvider && (
              <div>
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-medium text-ink">{record.patient}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-500">Uploaded by</p>
              <p className="font-medium text-ink">{record.uploadedBy}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Record date</p>
              <p className="font-medium text-ink">{record.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">File type</p>
              <p className="font-medium text-ink">{record.fileType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">File size</p>
              <p className="font-medium text-ink">{record.fileSize}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <FileText className="h-5 w-5 text-brand-600" />
            Description
          </h2>
          <p className="text-slate-600">{record.description}</p>
        </div>
      </div>

      {/* File Preview */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
          <Eye className="h-5 w-5 text-brand-600" />
          File preview
        </h2>
        <div className="rounded-lg border border-slate-200 bg-canvas p-12 text-center">
          <FileText className="mx-auto mb-4 h-24 w-24 text-slate-300" />
          <p className="mb-4 text-slate-500">PDF preview will be displayed here</p>
          <Button onClick={handleDownload} className="bg-brand-600 hover:bg-brand-700">
            <Download className="mr-2 h-4 w-4" />
            Download to view full document
          </Button>
        </div>
      </div>

      {/* Clinical Notes */}
      {(isProvider || record.notes.length > 0) && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-ink">
              <FileText className="h-5 w-5 text-brand-600" />
              Clinical notes
            </h2>
            {isProvider && (
              <Button asChild className="bg-brand-500 hover:bg-brand-600">
                <Link href={`/records/${id}/notes`}>Add note</Link>
              </Button>
            )}
          </div>

          {record.notes.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-500">No clinical notes yet</p>
              {isProvider && (
                <Button asChild className="mt-4 bg-brand-500 hover:bg-brand-600">
                  <Link href={`/records/${id}/notes`}>Add first note</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {record.notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-slate-200 bg-white/80 p-4">
                  <div className="mb-2">
                    <p className="font-semibold text-ink">{note.provider}</p>
                    <p className="text-sm text-slate-500">{note.date}</p>
                  </div>
                  <p className="text-slate-600">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-ink">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownload} className="bg-brand-500 hover:bg-brand-600">
            <Download className="mr-2 h-4 w-4" />
            Download record
          </Button>

          {!isProvider && (
            <>
              <Button onClick={handleShare} className="bg-brand-500 hover:bg-brand-600">
                <Share2 className="mr-2 h-4 w-4" />
                Share with provider
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete record
              </Button>
            </>
          )}

          {isProvider && (
            <Button asChild className="bg-brand-500 hover:bg-brand-600">
              <Link href={`/records/${id}/notes`}>Add clinical note</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-center">
        <Button onClick={() => router.push("/records")} className="bg-mist text-slate-700 hover:bg-slate-200">
          Back to records
        </Button>
      </div>
    </div>
  );
}
