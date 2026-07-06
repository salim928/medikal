import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, appointments, agentJobs } from "@/db";
import { desc, eq, between } from "drizzle-orm";

const router = Router();

// Get appointment analytics
router.get(
  "/appointments",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const appointmentsData = await db.query.appointments.findMany();

      const analytics = {
        total: appointmentsData.length,
        completed: appointmentsData.filter((a) => a.status === "completed")
          .length,
        cancelled: appointmentsData.filter((a) => a.status === "cancelled")
          .length,
        noshows: appointmentsData.filter((a) => a.status === "no_show").length,
        avgDuration: calculateAverageDuration(appointmentsData),
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }
);

// Get AI agent analytics
router.get(
  "/ai-agents",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const jobs = await db.query.agentJobs.findMany();

      const analytics = {
        totalJobs: jobs.length,
        successfulJobs: jobs.filter((j) => j.status === "success").length,
        failedJobs: jobs.filter((j) => j.status === "failed").length,
        avgLatencyMs: Math.round(
          jobs.reduce((sum, j) => sum + (j.latencyMs || 0), 0) / jobs.length
        ),
        avgTokensUsed: Math.round(
          jobs.reduce((sum, j) => sum + (j.tokensUsed || 0), 0) / jobs.length
        ),
        byAgent: groupByAgent(jobs),
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI analytics" });
    }
  }
);

// Helper functions
function calculateAverageDuration(appointments: any[]): number {
  if (appointments.length === 0) return 0;
  const total = appointments.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  return Math.round(total / appointments.length);
}

function groupByAgent(jobs: any[]): Record<string, number> {
  return jobs.reduce(
    (acc, job) => {
      acc[job.agentType] = (acc[job.agentType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

export default router;