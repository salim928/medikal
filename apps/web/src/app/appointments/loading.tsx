import { Calendar } from "lucide-react";

export default function AppointmentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-slate-600" />
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-mist rounded w-48"></div>
            <div className="h-4 bg-mist rounded w-64"></div>
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="h-12 bg-mist rounded mb-2"></div>
            <div className="h-4 bg-mist rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Appointments List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="space-y-3">
              <div className="h-6 bg-mist rounded w-32"></div>
              <div className="h-4 bg-mist rounded w-48"></div>
              <div className="h-4 bg-mist rounded w-64"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
