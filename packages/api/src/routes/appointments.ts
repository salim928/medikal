import { Router } from "express";
import { z } from "zod";
import { authMiddleware, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { db, appointments, users, providers } from "@/db";
import { eq, and } from "drizzle-orm";
import { triageAgent } from "@/ai";
import { createVideoRoom } from "../services/video";
import { sendAppointmentReminder } from "../services/notifications";

const router = Router();

const createAppointmentSchema = z.object({
  providerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  reasonForVisit: z.string().min(10),
  reasonCategory: z.enum(["follow_up", "acute", "preventive", "urgent"]),
});

// Book appointment
router.post(
  "/",
  authMiddleware,
  requireRole("patient"),
  validateBody(createAppointmentSchema),
  async (req, res) => {
    try {
      const { providerId, scheduledAt, reasonForVisit, reasonCategory } =
        req.body;

      // 1. Generate appointment ID first
      const appointmentId = crypto.randomUUID();

      // 2. Run AI triage
      const triageResult = await triageAgent({
        appointmentId,
        symptoms: reasonForVisit,
        vitals: {},
      });

      // 3. Create appointment
      const appointment = await db
        .insert(appointments)
        .values({
          id: appointmentId,
          orgId: req.user!.orgId,
          patientId: req.user!.id,
          providerId,
          scheduledAt: new Date(scheduledAt),
          reasonForVisit,
          reasonCategory,
          status: "pending",
          aiTriageResult: JSON.parse(JSON.stringify(triageResult)),
        })
        .returning();

      // 3. Send notifications
      const patient = await db.query.users.findFirst({
        where: eq(users.id, req.user!.id),
      });

      const provider = await db.query.providers.findFirst({
        where: eq(providers.id, providerId),
      });

      if (patient && provider) {
        await sendAppointmentReminder(
          patient.email,
          patient.phone!,
          providerId,
          new Date(scheduledAt)
        );
      }

      res.status(201).json(appointment[0]);
    } catch (error) {
      console.error("Appointment creation error:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  }
);

// Get appointments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userAppointments = await db.query.appointments.findMany({
      where: and(
        eq(appointments.orgId, req.user!.orgId),
        req.user!.role === "patient"
          ? eq(appointments.patientId, req.user!.id)
          : eq(appointments.providerId, req.user!.id)
      ),
    });

    res.json(userAppointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Get single appointment
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.id, id),
        eq(appointments.orgId, req.user!.orgId)
      ),
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check authorization
    if (
      req.user!.role === "patient" &&
      appointment.patientId !== req.user!.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (
      (req.user!.role === "provider" || req.user!.role === "doctor") &&
      appointment.providerId !== req.user!.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

// Update appointment (reschedule)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt, reasonForVisit } = req.body;

    // Verify appointment exists and user has access
    const existing = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.id, id),
        eq(appointments.orgId, req.user!.orgId)
      ),
    });

    if (!existing) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Only patient or provider can update
    if (
      req.user!.role === "patient" &&
      existing.patientId !== req.user!.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updateData: any = { updatedAt: new Date() };
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (reasonForVisit) updateData.reasonForVisit = reasonForVisit;

    const updated = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// Cancel appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify appointment exists and user has access
    const existing = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.id, id),
        eq(appointments.orgId, req.user!.orgId)
      ),
    });

    if (!existing) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Only patient or provider can cancel
    if (
      req.user!.role === "patient" &&
      existing.patientId !== req.user!.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Soft delete by updating status
    const cancelled = await db
      .update(appointments)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    res.json({
      success: true,
      message: "Appointment cancelled",
      appointment: cancelled[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

// Approve AI triage
router.post(
  "/:id/approve-triage",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await db
        .update(appointments)
        .set({
          aiTriageApprovedBy: req.user!.id,
          aiTriageApprovedAt: new Date(),
        })
        .where(eq(appointments.id, id))
        .returning();

      res.json(appointment[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve triage" });
    }
  }
);

// Create video room
router.post("/:id/video-room", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await db.query.appointments.findFirst({
      where: eq(appointments.id, id),
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const room = await createVideoRoom(id);

    // Update appointment with room
    await db
      .update(appointments)
      .set({ dailyRoomName: room.name })
      .where(eq(appointments.id, id));

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Failed to create video room" });
  }
});

export default router;