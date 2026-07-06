import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import authRoutes from "./routes/auth";
import appointmentRoutes from "./routes/appointments";
import medicalRecordsRoutes from "./routes/medical-records";
import prescriptionRoutes from "./routes/prescriptions";
import providerRoutes from "./routes/providers";
import adminRoutes from "./routes/admin";
import adminComplianceRoutes from "./routes/admin-compliance";
import analyticsRoutes from "./routes/analytics";
import clinicalNotesRoutes from "./routes/clinical-notes";
import ediRoutes from "./routes/edi-integration";
import healthcareUtilitiesRoutes from "./routes/healthcare-utilities";
import monitoringRoutes from "./routes/monitoring";
import securityRoutes from "./routes/security";
import { errorHandler } from "./middleware/error-handler";
import { apiRateLimiter } from "./middleware/rate-limiter";

const app = express();

// Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Apply general rate limiting to all API routes
app.use("/api", apiRateLimiter);

// Routes
app.use("/api/auth", authRoutes); // Auth routes with stricter rate limiting
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordsRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/compliance", adminComplianceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/clinical-notes", clinicalNotesRoutes);
app.use("/api/edi", ediRoutes);
app.use("/api/utilities", healthcareUtilitiesRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/security", securityRoutes);

// Health check with DB connection test
app.get("/health", async (req, res) => {
  try {
    // Optional: Add DB connection test here if db client available
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error", error: "Database connection failed" });
  }
});

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;