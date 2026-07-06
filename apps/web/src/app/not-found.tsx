"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-brand-600/20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="w-24 h-24 text-brand-600" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-ink">Page Not Found</h1>
          <p className="text-xl text-slate-600">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-slate-500">
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button
            asChild
            className="bg-mist hover:bg-slate-200 text-ink"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/appointments" className="text-brand-600 hover:text-brand-700 text-sm">
              Appointments
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/records" className="text-brand-600 hover:text-brand-700 text-sm">
              Medical Records
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/prescriptions" className="text-brand-600 hover:text-brand-700 text-sm">
              Prescriptions
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/providers" className="text-brand-600 hover:text-brand-700 text-sm">
              Find Doctors
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/settings/profile" className="text-brand-600 hover:text-brand-700 text-sm">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
