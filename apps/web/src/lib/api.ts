import { AxiosInstance } from "axios";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Appointment endpoints
export const appointmentAPI = {
  create: (data: any) => apiClient.post("/appointments", data),
  list: () => apiClient.get("/appointments"),
  get: (id: string) => apiClient.get(`/appointments/${id}`),
  update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
  approveTriage: (id: string) => apiClient.post(`/appointments/${id}/approve-triage`),
  createVideoRoom: (id: string) => apiClient.post(`/appointments/${id}/video-room`),
};

// Medical records endpoints
export const medicalRecordsAPI = {
  upload: (data: any) => apiClient.post("/medical-records", data),
  list: () => apiClient.get("/medical-records"),
  get: (id: string) => apiClient.get(`/medical-records/${id}`),
  update: (id: string, data: any) => apiClient.put(`/medical-records/${id}`, data),
  delete: (id: string) => apiClient.delete(`/medical-records/${id}`),
};

// Prescription endpoints
export const prescriptionAPI = {
  create: (data: any) => apiClient.post("/prescriptions", data),
  listByPatient: (patientId: string) => apiClient.get(`/prescriptions/patient/${patientId}`),
  get: (id: string) => apiClient.get(`/prescriptions/${id}`),
  approve: (id: string) => apiClient.post(`/prescriptions/${id}/approve`),
  checkInteractions: (id: string, data: any) => apiClient.post(`/prescriptions/${id}/check-interactions`, data),
  delete: (id: string) => apiClient.delete(`/prescriptions/${id}`),
};

// Provider endpoints
export const providerAPI = {
  list: (params?: { specialty?: string; available?: boolean }) => apiClient.get("/providers", { params }),
  get: (id: string) => apiClient.get(`/providers/${id}`),
  update: (id: string, data: any) => apiClient.put(`/providers/${id}`, data),
  getStats: () => apiClient.get("/providers/dashboard-stats"),
  getConsultations: () => apiClient.get("/providers/consultations"),
  getPendingReviews: () => apiClient.get("/providers/pending-reviews"),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => apiClient.get("/admin/stats"),
  getUsers: () => apiClient.get("/admin/users"),
  updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
  getComplianceReport: (startDate: string, endDate: string) => 
    apiClient.get("/admin/compliance/compliance-report", { params: { startDate, endDate } }),
  getAuditTrail: (limit?: number, offset?: number) =>
    apiClient.get("/admin/compliance/audit-trail", { params: { limit, offset } }),
};

// Clinical notes endpoints
export const clinicalNotesAPI = {
  generate: (appointmentId: string) => apiClient.post("/clinical-notes/generate", { appointmentId }),
  listByAppointment: (appointmentId: string) => apiClient.get(`/clinical-notes/appointment/${appointmentId}`),
  approve: (id: string) => apiClient.post(`/clinical-notes/${id}/approve`),
};

// Analytics endpoints
export const analyticsAPI = {
  getAppointments: (startDate: string, endDate: string) =>
    apiClient.get("/analytics/appointments", { params: { startDate, endDate } }),
  getAgentUsage: (startDate: string, endDate: string) =>
    apiClient.get("/analytics/agent-usage", { params: { startDate, endDate } }),
};

// Monitoring endpoints (admin only)
export const monitoringAPI = {
  getSystemMetrics: () => apiClient.get("/monitoring/system-metrics"),
  getActiveAlerts: () => apiClient.get("/monitoring/active-alerts"),
  getPerformance: () => apiClient.get("/monitoring/performance"),
  getHealth: () => apiClient.get("/monitoring/health"),
};

// Security endpoints
export const securityAPI = {
  refreshToken: (refreshToken: string) => apiClient.post("/security/refresh-token", { refreshToken }),
  revokeToken: () => apiClient.post("/security/revoke-token"),
  getSession: () => apiClient.get("/security/session"),
  getRateLimitStatus: () => apiClient.get("/security/rate-limit-status"),
};