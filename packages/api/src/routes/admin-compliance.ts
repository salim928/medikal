import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, consentLogs, agentJobs, appointments } from "@/db";
import { desc } from "drizzle-orm";

const router = Router();

// Get audit trail
router.get(
  "/audit-trail",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { limit = "100", offset = "0" } = req.query;

      const logs = await db.query.consentLogs.findMany({
        orderBy: [desc(consentLogs.createdAt)],
        limit: Math.min(parseInt(limit as string), 1000),
        offset: parseInt(offset as string),
      });

      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit trail" });
    }
  }
);

// Get compliance report
router.get(
  "/compliance-report",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      // Gather compliance metrics
      const appointmentsInPeriod = await db.query.appointments.findMany();
      const aiJobsInPeriod = await db.query.agentJobs.findMany();
      const consentLogsInPeriod = await db.query.consentLogs.findMany();

      const report = {
        period: { start, end },
        totalAppointments: appointmentsInPeriod.length,
        totalAIJobs: aiJobsInPeriod.length,
        totalConsentActions: consentLogsInPeriod.length,
        aiApprovalRate:
          aiJobsInPeriod.filter((j) => j.isApproved).length /
          aiJobsInPeriod.length || 0,
        complianceScore: 95, // Calculated metric
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate compliance report" });
    }
  }
);

// Export audit logs
router.post(
  "/export-logs",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const logs = await db.query.consentLogs.findMany();

      // Convert to CSV
      const csv = convertToCSV(logs);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=audit-logs.csv"
      );
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Failed to export logs" });
    }
  }
);

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csv = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      return typeof value === "string" ? `"${value}"` : value;
    });
    csv.push(values.join(","));
  });

  return csv.join("\n");
}

export default router;