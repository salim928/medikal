import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, clinicalNotes, agentJobs, appointments } from "@/db";
import { eq } from "drizzle-orm";
import { clinicalDocAgent } from "@/ai";

const router = Router();

// Generate clinical notes with AI
router.post(
  "/generate",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { appointmentId } = req.body;

      // Get appointment
      const appointment = await db.query.appointments.findFirst({
        where: (appointments, { eq }) => eq(appointments.id, appointmentId),
      });

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Generate notes using AI agent
      const aiNotes = await clinicalDocAgent({
        appointmentId,
        chiefComplaint: appointment.chiefComplaint || "",
        patientHistory: "",
        examination: "",
        vitals: {},
      });

      // Store AI-generated notes
      const note = await db
        .insert(clinicalNotes)
        .values({
          id: crypto.randomUUID(),
          orgId: appointment.orgId,
          appointmentId,
          patientId: appointment.patientId,
          providerId: appointment.providerId,
          noteType: "assessment",
          aiGeneratedContent: aiNotes,
          createdAt: new Date(),
        })
        .returning();

      res.status(201).json(note[0]);
    } catch (error) {
      console.error("Failed to generate notes:", error);
      res.status(500).json({ error: "Failed to generate clinical notes" });
    }
  }
);

// Get clinical notes for appointment
router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { appointmentId } = req.params;

      const notes = await db.query.clinicalNotes.findMany({
        where: (clinicalNotes, { eq }) =>
          eq(clinicalNotes.appointmentId, appointmentId),
      });

      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clinical notes" });
    }
  }
);

// Approve clinical notes
router.post(
  "/:id/approve",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { edits } = req.body;

      const updated = await db
        .update(clinicalNotes)
        .set({
          clinicianApprovedContent: edits,
          clinicianApprovedBy: req.user!.id,
          clinicianApprovedAt: new Date(),
        })
        .where(eq(clinicalNotes.id, id))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve notes" });
    }
  }
);

export default router;