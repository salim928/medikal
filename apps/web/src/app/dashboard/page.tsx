"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { 
  Stethoscope, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Users, 
  FileText, 
  Video, 
  Pill, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Brain, 
  Search 
} from "lucide-react";

export default function DashboardPage() {
  const { user, role, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user) {
        const userRole = role || user.user_metadata?.role || "patient";
        console.log("🔀 Redirecting to role-specific dashboard:", userRole);
        router.replace(`/dashboard/${userRole}`);
      }
    }
  }, [isAuthenticated, loading, user, role, router]);

  // Always show loading state - never render the dashboard content here
  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
