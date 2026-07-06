"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { TriageReview } from "@/components/appointments/TriageReview";

interface PendingReview {
  id: string;
  type: string;
  appointmentId: string;
  patientName: string;
  createdAt: string;
  content: any;
}

export default function AIReviewsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get("/providers/pending-reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const handleApprove = async (reviewId: string) => {
    try {
      await apiClient.post(`/providers/reviews/${reviewId}/approve`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      setSelectedReview(null);
      alert("Review approved and executed");
    } catch (error) {
      alert("Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await apiClient.post(`/providers/reviews/${reviewId}/reject`);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      setSelectedReview(null);
      alert("Review rejected");
    } catch (error) {
      alert("Failed to reject review");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Review Queue</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review List */}
        <div className="lg:col-span-2">
          {loadingData ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">No pending reviews</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className={`cursor-pointer transition ${
                    selectedReview?.id === review.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedReview(review)}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg capitalize">
                          {review.type} Review
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Patient: {review.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Review Detail */}
        <div className="lg:col-span-1">
          {selectedReview ? (
            <div className="space-y-4">
              <TriageReview
                appointmentId={selectedReview.appointmentId}
                triageResult={selectedReview.content}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleApprove(selectedReview.id)}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  ✓ Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedReview.id)}
                  variant="destructive"
                >
                  ✗ Reject
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">Select a review to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}