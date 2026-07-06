"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalRecordsAPI } from "@/lib/api";
import { medicalRecords } from "@/lib/data";

export function useMedicalRecords() {
  const queryClient = useQueryClient();

  const recordsQuery = useQuery({
    queryKey: ["medical-records"],
    queryFn: async () => {
      // Backend offline — serve the canonical demo records from the central data layer.
      return medicalRecords;
    },
    placeholderData: [],
  });

  const uploadMutation = useMutation({
    mutationFn: medicalRecordsAPI.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => medicalRecordsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: medicalRecordsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  return {
    records: recordsQuery.data || [],
    isLoading: recordsQuery.isLoading,
    error: recordsQuery.error,
    uploadRecord: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    updateRecord: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteRecord: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: recordsQuery.refetch,
  };
}