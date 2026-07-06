"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface Consultation {
  id: string;
  patientName: string;
  patientEmail: string;
  scheduledAt: string;
  status: string;
  reason: string;
  roomUrl?: string;
}

export default function ConsultationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await apiClient.get("/providers/consultations");
        setConsultations(response.data);
      } catch (error) {
        console.error("Failed to load consultations:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchConsultations();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Consultations</h1>
        <Button asChild>
          <Link href="/provider/schedule">Manage Schedule</Link>
        </Button>
      </div>

      {loadingData ? (
        <div className="text-center py-8">Loading consultations...</div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No consultations scheduled</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {consultation.patientName}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {consultation.patientEmail}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      📅 {new Date(consultation.scheduledAt).toLocaleString()}
                    </p>
                    <p className="text-sm mt-2 text-gray-700">
                      <span className="font-medium">Reason:</span> {consultation.reason}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {consultation.status === "pending" && (
                      <Button asChild>
                        <Link href={`/consultations/${consultation.id}`}>
                          Join
                        </Link>
                      </Button>
                    )}
                    {consultation.status === "completed" && (
                      <Button asChild variant="outline">
                        <Link href={`/consultations/${consultation.id}/notes`}>
                          View Notes
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="secondary">
                      <Link href={`/consultations/${consultation.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}