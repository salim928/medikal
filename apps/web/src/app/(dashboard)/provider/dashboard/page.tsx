"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface DashboardStats {
  totalConsultations: number;
  upcomingAppointments: number;
  pendingApprovals: number;
  averageRating: number;
  revenueThisMonth: number;
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/providers/dashboard-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/provider/schedule">Manage Schedule</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/provider/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Total Consultations</p>
              <p className="text-3xl font-bold mt-2">{stats.totalConsultations}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Upcoming Appointments</p>
              <p className="text-3xl font-bold mt-2">{stats.upcomingAppointments}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold mt-2 text-yellow-600">
                {stats.pendingApprovals}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-3xl font-bold mt-2">
                {stats.averageRating.toFixed(1)} ⭐
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-sm">Revenue (MTD)</p>
              <p className="text-3xl font-bold mt-2">
                ${(stats.revenueThisMonth / 100).toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Next Appointment</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View and prepare for your next consultation
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/provider/consultations">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Pending AI Reviews</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Approve AI-generated clinical notes and assessments
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/provider/ai-reviews">Review Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Patient Messages</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Check messages from your patients
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/provider/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}