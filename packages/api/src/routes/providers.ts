import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, providers, appointments, agentJobs } from "@/db";
import { eq, and, desc, count } from "drizzle-orm";

const router = Router();

// List all providers (for patients to book appointments)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { specialty, available } = req.query;

    let query = db.query.providers.findMany({
      orderBy: [desc(providers.avgRating)],
    });

    // TODO: Add filtering by specialty and availability when needed

    const allProviders = await query;

    res.json(allProviders);
  } catch (error) {
    res.status(500).json({ error: "Failed to load providers" });
  }
});

// Get single provider details
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await db.query.providers.findFirst({
      where: eq(providers.id, id),
    });

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Get provider's stats
    const totalConsultations = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.providerId, id),
          eq(appointments.status, "completed")
        )
      );

    res.json({
      ...provider,
      stats: {
        totalConsultations: totalConsultations[0].count,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load provider" });
  }
});

// Update provider profile
router.put(
  "/:id",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { bio, specialties, languages } = req.body;

      // Verify provider owns this profile
      if (req.user!.id !== id && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updateData: any = {};
      if (bio) updateData.bio = bio;
      if (specialties) updateData.specialties = specialties;
      if (languages) updateData.languages = languages;

      const updated = await db
        .update(providers)
        .set(updateData)
        .where(eq(providers.id, id))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update provider" });
    }
  }
);

// Get provider dashboard stats
router.get(
  "/dashboard-stats",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const providerId = req.user!.id;

      const totalConsultations = await db
        .select({ count: count() })
        .from(appointments)
        .where(eq(appointments.providerId, providerId));

      const upcomingAppointments = await db
        .select({ count: count() })
        .from(appointments)
        .where(
          and(
            eq(appointments.providerId, providerId),
            eq(appointments.status, "confirmed")
          )
        );

      const pendingApprovals = await db
        .select({ count: count() })
        .from(agentJobs)
        .where(
          and(
            eq(agentJobs.approvedBy, null),
            eq(agentJobs.status, "success")
          )
        );

      const provider = await db.query.providers.findFirst({
        where: eq(providers.id, providerId),
      });

      res.json({
        totalConsultations: totalConsultations[0].count,
        upcomingAppointments: upcomingAppointments[0].count,
        pendingApprovals: pendingApprovals[0].count,
        averageRating: provider?.avgRating || 0,
        revenueThisMonth: 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to load stats" });
    }
  }
);

// Get provider's consultations
router.get(
  "/consultations",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const providerId = req.user!.id;

      const consultations = await db.query.appointments.findMany({
        where: eq(appointments.providerId, providerId),
        orderBy: [desc(appointments.scheduledAt)],
      });

      res.json(consultations);
    } catch (error) {
      res.status(500).json({ error: "Failed to load consultations" });
    }
  }
);

// Get pending reviews for provider
router.get(
  "/pending-reviews",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const reviews = await db.query.agentJobs.findMany({
        where: and(
          eq(agentJobs.approvedBy, null),
          eq(agentJobs.status, "success")
        ),
        orderBy: [desc(agentJobs.createdAt)],
      });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to load reviews" });
    }
  }
);

// Approve AI review
router.post(
  "/reviews/:id/approve",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;

      await db
        .update(agentJobs)
        .set({
          isApproved: true,
          approvedBy: req.user!.id,
          approvedAt: new Date(),
        })
        .where(eq(agentJobs.id, id));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  }
);

export default router;