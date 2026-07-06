import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-brand-50 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-brand-500/20 to-brand-500/20 p-8 rounded-full border border-slate-200">
            <Activity className="w-16 h-16 text-brand-600 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-ink">medicom</h2>
          <p className="text-slate-500">Loading your healthcare portal...</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-brand-600 to-brand-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
