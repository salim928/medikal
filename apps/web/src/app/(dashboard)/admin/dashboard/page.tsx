"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalAppointments: number;
  totalRevenue: number;
  systemHealth: {
    apiLatency: number;
    errorRate: number;
    uptime: number;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/organization">Organization</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/admin/compliance">Compliance</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Total Providers</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProviders}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAppointments}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">
                  ${(stats.totalRevenue / 100).toFixed(0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">System Health</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">API Latency (P95)</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{stats.systemHealth.apiLatency}</p>
                    <p className="text-sm text-gray-600">ms</p>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div
                      className={`h-full rounded ${
                        stats.systemHealth.apiLatency < 250
                          ? "bg-brand-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(stats.systemHealth.apiLatency / 5, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Error Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">
                      {stats.systemHealth.errorRate.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">%</p>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div
                      className={`h-full rounded ${
                        stats.systemHealth.errorRate < 0.1
                          ? "bg-brand-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(stats.systemHealth.errorRate * 10, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Uptime</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">
                      {stats.systemHealth.uptime.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">%</p>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div
                      className="h-full rounded bg-brand-500"
                      style={{
                        width: `${stats.systemHealth.uptime}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">User Management</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage users, roles, and permissions
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Compliance & Audit</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View audit logs and compliance reports
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin/compliance">View Audit</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">System Monitoring</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Monitor system performance and alerts
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin/monitoring">View Monitoring</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}