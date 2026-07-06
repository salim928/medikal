"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { providerAPI } from "@/lib/api";

export function useProviders(params?: { specialty?: string; available?: boolean }) {
  const queryClient = useQueryClient();

  const providersQuery = useQuery({
    queryKey: ["providers", params],
    queryFn: async () => {
      try {
        const response = await providerAPI.list(params);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Failed to fetch providers:", error);
        // Return mock data as fallback
        return [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Internal Medicine',
            avgRating: 4.8,
            bio: 'Board certified in Internal Medicine',
            languages: ['English', 'Spanish'],
          },
          {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'Pediatrics',
            avgRating: 4.9,
            bio: 'Pediatric specialist with 15 years experience',
            languages: ['English', 'Mandarin'],
          }
        ];
      }
    },
    placeholderData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => providerAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  return {
    providers: providersQuery.data || [],
    isLoading: providersQuery.isLoading,
    error: providersQuery.error,
    updateProvider: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    refetch: providersQuery.refetch,
  };
}

export function useProviderStats() {
  const statsQuery = useQuery({
    queryKey: ["provider-stats"],
    queryFn: async () => {
      try {
        const response = await providerAPI.getStats();
        return response.data;
      } catch (error) {
        console.error("Failed to fetch provider stats:", error);
        return {
          totalConsultations: 0,
          upcomingAppointments: 0,
          pendingApprovals: 0,
          averageRating: 0,
          revenueThisMonth: 0,
        };
      }
    },
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
}

export function useProviderConsultations() {
  const consultationsQuery = useQuery({
    queryKey: ["provider-consultations"],
    queryFn: async () => {
      try {
        const response = await providerAPI.getConsultations();
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
        return [];
      }
    },
    placeholderData: [],
  });

  return {
    consultations: consultationsQuery.data || [],
    isLoading: consultationsQuery.isLoading,
    error: consultationsQuery.error,
    refetch: consultationsQuery.refetch,
  };
}
