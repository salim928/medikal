import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await apiClient.get("/appointments");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    appointments: appointmentsQuery.data,
    isLoading: appointmentsQuery.isLoading,
    error: appointmentsQuery.error,
    createAppointment: createMutation.mutate,
    isCreating: createMutation.isPending,
    refetch: appointmentsQuery.refetch,
  };
}