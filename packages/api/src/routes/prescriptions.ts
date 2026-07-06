import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import { db, prescriptions, agentJobs } from "@/db";
import { eq, and } from "drizzle-orm";
import { validateBody } from "../middleware/validation";
import { z } from "zod";

const router = Router();

const createPrescriptionSchema = z.object({
  appointmentId: z.string().uuid(),
  medicationName: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  durationDays: z.number().positive(),
  quantity: z.number().positive(),
  refills: z.number().nonnegative().default(0),
});

// Create prescription
router.post(
  "/",
  authMiddleware,
  requireRole("provider"),
  validateBody(createPrescriptionSchema),
  async (req, res) => {
    try {
      const { appointmentId, ...prescriptionData } = req.body;

      // Get appointment
      const appointment = await db.query.appointments.findFirst({
        where: (appointments, { eq }) => eq(appointments.id, appointmentId),
      });

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Create prescription
      const newPrescription = await db
        .insert(prescriptions)
        .values({
          id: crypto.randomUUID(),
          orgId: appointment.orgId,
          appointmentId,
          patientId: appointment.patientId,
          providerId: appointment.providerId,
          ...prescriptionData,
          status: "draft",
        })
        .returning();

      res.status(201).json(newPrescription[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create prescription" });
    }
  }
);

// Get prescriptions for patient
router.get(
  "/patient/:patientId",
  authMiddleware,
  async (req, res) => {
    try {
      const { patientId } = req.params;

      const patientPrescriptions = await db.query.prescriptions.findMany({
        where: (prescriptions, { eq }) => eq(prescriptions.patientId, patientId),
      });

      res.json(patientPrescriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prescriptions" });
    }
  }
);

// Get single prescription
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const prescription = await db.query.prescriptions.findFirst({
        where: (prescriptions, { eq }) => eq(prescriptions.id, id),
      });

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      // Check authorization
      if (
        req.user!.role === "patient" &&
        prescription.patientId !== req.user!.id
      ) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.json(prescription);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prescription" });
    }
  }
);

// Approve prescription
router.post(
  "/:id/approve",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await db
        .update(prescriptions)
        .set({
          providerApproved: true,
          providerApprovedAt: new Date(),
          status: "signed",
        })
        .where(eq(prescriptions.id, id))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve prescription" });
    }
  }
);

// Check drug interactions
router.post(
  "/:id/check-interactions",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { currentMedications, allergies } = req.body;

      const prescription = await db.query.prescriptions.findFirst({
        where: (prescriptions, { eq }) => eq(prescriptions.id, id),
      });

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      // Run drug interaction agent job
      const allMedications = [
        prescription.medicationName,
        ...(currentMedications || []),
      ];

      // This would call the drug interaction agent
      const interactions: string[] = [];

      // Update prescription with red flags
      if (interactions.length > 0) {
        await db
          .update(prescriptions)
          .set({ redFlags: interactions })
          .where(eq(prescriptions.id, id));
      }

      res.json({ interactions });
    } catch (error) {
      res.status(500).json({ error: "Failed to check interactions" });
    }
  }
);

// Cancel/delete prescription
router.delete(
  "/:id",
  authMiddleware,
  requireRole("provider"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const prescription = await db.query.prescriptions.findFirst({
        where: (prescriptions, { eq }) => eq(prescriptions.id, id),
      });

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      // Soft delete by updating status
      const cancelled = await db
        .update(prescriptions)
        .set({
          status: "cancelled",
        })
        .where(eq(prescriptions.id, id))
        .returning();

      res.json({
        success: true,
        message: "Prescription cancelled",
        prescription: cancelled[0],
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel prescription" });
    }
  }
);

export default router;