import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, users, appointments, organizations } from "@/db";
import { eq, count } from "drizzle-orm";

const router = Router();

// Get admin stats
router.get(
  "/stats",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const totalUsersResult = await db
        .select({ count: count() })
        .from(users);

      const totalAppointmentsResult = await db
        .select({ count: count() })
        .from(appointments);

      res.json({
        totalUsers: totalUsersResult[0].count,
        totalProviders: 0, // Would filter by role
        totalAppointments: totalAppointmentsResult[0].count,
        totalRevenue: 0,
        systemHealth: {
          apiLatency: Math.random() * 250,
          errorRate: Math.random() * 0.1,
          uptime: 99.9,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load stats" });
    }
  }
);

// Get all users
router.get(
  "/users",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany();

      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to load users" });
    }
  }
);

// Update user
router.put(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role, status } = req.body;

      const updatedUser = await db
        .update(users)
        .set({ role, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      res.json(updatedUser[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

export default router;