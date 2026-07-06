import { Router } from "express";
import { z } from "zod";
// TODO: Import from your auth middleware and db when available
// import { authMiddleware } from "../middleware/auth";
// import { db } from "@mediconnect/db";

const router = Router();

// Schema for medical record upload
const uploadRecordSchema = z.object({
  type: z.enum(["lab_result", "imaging", "prescription", "consultation_note", "other"]),
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  date: z.string().datetime(),
  providerId: z.string().uuid().optional(),
});

// Get medical records for user
router.get("/", async (req, res) => {
  try {
    // TODO: Uncomment when auth middleware is available
    // const userId = req.user!.id;

    // Mock data for now
    const records = [
      {
        id: "1",
        type: "lab_result",
        title: "Blood Test Results",
        description: "Routine blood work",
        fileUrl: "https://example.com/records/lab1.pdf",
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch medical records",
    });
  }
});

// Upload new medical record
router.post("/", async (req, res) => {
  try {
    const validatedData = uploadRecordSchema.parse(req.body);
    
    // TODO: Uncomment when auth middleware and db are available
    // const userId = req.user!.id;
    // const record = await db.insert(medicalRecords).values({
    //   ...validatedData,
    //   userId,
    // }).returning();

    // Mock response for now
    const record = {
      id: crypto.randomUUID(),
      ...validatedData,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }

    console.error("Error uploading medical record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload medical record",
    });
  }
});

// Get specific medical record
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Uncomment when db is available
    // const record = await db.query.medicalRecords.findFirst({
    //   where: eq(medicalRecords.id, id)
    // });

    // Mock response for now
    const record = {
      id,
      type: "lab_result",
      title: "Blood Test Results",
      description: "Routine blood work",
      fileUrl: "https://example.com/records/lab1.pdf",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (!record) {
      return res.status(404).json({
        success: false,
        error: "Medical record not found",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching medical record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch medical record",
    });
  }
});

// Delete medical record
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Uncomment when db is available
    // await db.delete(medicalRecords).where(eq(medicalRecords.id, id));

    res.json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete medical record",
    });
  }
});

// Update medical record
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type } = req.body;

    // Validate at least one field is provided
    if (!title && !description && !type) {
      return res.status(400).json({
        success: false,
        error: "At least one field (title, description, type) must be provided",
      });
    }

    // TODO: Uncomment when db is available
    // const updateData: any = { updatedAt: new Date() };
    // if (title) updateData.title = title;
    // if (description) updateData.description = description;
    // if (type) updateData.type = type;
    
    // const updated = await db
    //   .update(medicalRecords)
    //   .set(updateData)
    //   .where(eq(medicalRecords.id, id))
    //   .returning();

    // Mock response for now
    const updated = {
      id,
      title: title || "Blood Test Results",
      description: description || "Routine blood work",
      type: type || "lab_result",
      fileUrl: "https://example.com/records/lab1.pdf",
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "Medical record updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update medical record",
    });
  }
});

export default router;
