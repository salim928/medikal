import { FileText } from "lucide-react";

export default function RecordsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-slate-600" />
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-mist rounded w-56"></div>
            <div className="h-4 bg-mist rounded w-72"></div>
          </div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="h-10 bg-mist rounded"></div>
      </div>

      {/* Records List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-mist rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-mist rounded w-48"></div>
                <div className="h-4 bg-mist rounded w-32"></div>
                <div className="h-4 bg-mist rounded w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-24 bg-mist rounded"></div>
                <div className="h-10 w-24 bg-mist rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
