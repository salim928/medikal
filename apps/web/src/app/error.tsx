"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-red-500/20 to-brand-500/20 p-8 rounded-full border border-red-500/30">
              <AlertTriangle className="w-16 h-16 text-red-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-ink">Something Went Wrong</h1>
          <p className="text-xl text-slate-600">
            We encountered an unexpected error.
          </p>
          <p className="text-slate-500">
            Don't worry, our team has been notified and we're working on it.
          </p>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-white border border-red-500/30 rounded-lg p-6 text-left">
            <p className="text-sm text-red-600 font-mono mb-2">Error Details:</p>
            <p className="text-sm text-slate-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            asChild
            className="bg-mist hover:bg-slate-200 text-ink"
          >
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <p className="text-sm text-slate-500">
            If the problem persists, please contact our support team.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <a
              href="mailto:support@mediconnect.com"
              className="text-brand-600 hover:text-brand-700"
            >
              support@mediconnect.com
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="tel:+1-555-MEDICAL"
              className="text-brand-600 hover:text-brand-700"
            >
              1-555-MEDICAL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
