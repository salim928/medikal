"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LineChart } from "@/components/analytics/LineChart";
import { BarChart } from "@/components/analytics/BarChart";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";

export default function MonitoringPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [metricsRes, alertsRes] = await Promise.all([
          apiClient.get("/admin/system-metrics"),
          apiClient.get("/admin/active-alerts"),
        ]);
        setMetrics(metricsRes.data);
        setAlerts(alertsRes.data);
      } catch (error) {
        console.error("Failed to load monitoring data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  if (loading || isLoading) {
    return <div className="text-center py-8">Loading monitoring dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>Refresh</Button>
          <Button variant="secondary">Advanced</Button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <h3 className="font-semibold text-red-900">
              🚨 {alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start bg-white p-3 rounded border border-red-200"
                >
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">API Latency (P95)</p>
                <p className="text-3xl font-bold mt-2">{metrics.apiLatency}ms</p>
                <div className="mt-2 h-2 bg-gray-200 rounded">
                  <div
                    className={`h-full rounded ${
                      metrics.apiLatency < 250 ? "bg-brand-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min((metrics.apiLatency / 500) * 100, 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Error Rate</p>
                <p className="text-3xl font-bold mt-2">{metrics.errorRate}%</p>
                <div className="mt-2 h-2 bg-gray-200 rounded">
                  <div
                    className={`h-full rounded ${
                      metrics.errorRate < 0.1 ? "bg-brand-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(metrics.errorRate * 10, 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Uptime</p>
                <p className="text-3xl font-bold mt-2">{metrics.uptime}%</p>
                <div className="mt-2 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full rounded bg-brand-500"
                    style={{ width: `${metrics.uptime}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold mt-2">{metrics.activeUsers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="API Response Time (Last 24 Hours)"
              data={metrics.latencyTrend || []}
              lines={[
                { key: "p50", color: "#10b981", label: "P50" },
                { key: "p95", color: "#f59e0b", label: "P95" },
                { key: "p99", color: "#ef4444", label: "P99" },
              ]}
            />
            <LineChart
              title="Error Rate (Last 24 Hours)"
              data={metrics.errorTrend || []}
              lines={[
                { key: "errorRate", color: "#ef4444", label: "Error Rate %" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Requests by Endpoint"
              data={metrics.requestsByEndpoint || []}
              dataKey="count"
              color="#0066cc"
            />
            <BarChart
              title="AI Agent Usage"
              data={metrics.agentUsage || []}
              dataKey="count"
              color="#8b5cf6"
            />
          </div>
        </>
      )}

      {/* System Health Details */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Service Health</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "API Server", status: "healthy" },
              { name: "Database", status: "healthy" },
              { name: "Cache (Redis)", status: "healthy" },
              { name: "Video Service", status: "healthy" },
              { name: "ChromaDB", status: "healthy" },
              { name: "Groq API", status: "healthy" },
              { name: "Email Service", status: "healthy" },
              { name: "Storage", status: "healthy" },
            ].map((service) => (
              <div key={service.name} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    service.status === "healthy"
                      ? "bg-brand-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}