"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentAPI } from "@/lib/api";

export function useAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      // TEMP: Skip API call until backend is ready
      // Return mock data for development
      console.log("📅 Using mock appointments data (backend not connected)");
      return [
        {
          id: '1',
          patient: 'John Smith',
          date: '2025-01-20',
          time: '10:00 AM',
          reason: 'Regular Checkup',
          status: 'scheduled',
          location: 'virtual',
          type: 'consultation'
        },
        {
          id: '2',
            patient: 'Sarah Johnson',
            date: '2025-01-20',
            time: '2:00 PM',
            reason: 'Follow-up',
            status: 'scheduled',
            location: 'in-person',
            type: 'follow-up'
          },
          {
            id: '3',
            patient: 'Mike Davis',
            date: '2025-01-18',
            time: '11:00 AM',
            reason: 'Consultation',
            status: 'completed',
            location: 'virtual',
            type: 'consultation'
          }
        ];
    },
    placeholderData: [],
  });

  const createMutation = useMutation({
    mutationFn: appointmentAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => appointmentAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const approveTriage = useMutation({
    mutationFn: ({ id }: { id: string }) => appointmentAPI.approveTriage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const createVideoRoom = useMutation({
    mutationFn: ({ id }: { id: string }) => appointmentAPI.createVideoRoom(id),
  });

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    error: appointmentsQuery.error,
    createAppointment: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateAppointment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteAppointment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    approveTriage: approveTriage.mutate,
    isApprovingTriage: approveTriage.isPending,
    createVideoRoom: createVideoRoom.mutate,
    isCreatingRoom: createVideoRoom.isPending,
    refetch: appointmentsQuery.refetch,
  };
}