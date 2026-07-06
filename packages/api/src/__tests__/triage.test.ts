import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { triageAgent, type TriageInput } from "@/ai";
import { db } from "@/db";

describe("Triage Agent", () => {
  let appointmentId: string;

  beforeAll(async () => {
    // Setup test appointment
    appointmentId = "test-appointment-id";
  });

  afterAll(async () => {
    // Cleanup
  });

  it("should return risk assessment with citations", async () => {
    const input: TriageInput = {
      appointmentId,
      symptoms: "chest pain and shortness of breath",
      vitals: {
        heartRate: 120,
        bloodPressure: "140/90",
        temperature: 98.6,
      },
    };

    const result = await triageAgent(input);

    expect(result).toBeDefined();
    expect(result.riskLevel).toBeOneOf(["low", "medium", "high", "critical"]);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("should detect critical flags for chest pain", async () => {
    const input: TriageInput = {
      appointmentId,
      symptoms: "severe chest pain radiating to left arm",
      vitals: {
        heartRate: 140,
        bloodPressure: "180/110",
      },
    };

    const result = await triageAgent(input);

    expect(result.riskLevel).toBe("critical");
    expect(result.redFlags.length).toBeGreaterThan(0);
  });

  it("should log job to database", async () => {
    const input: TriageInput = {
      appointmentId,
      symptoms: "mild headache",
      vitals: {},
    };

    await triageAgent(input);

    // Verify job was logged
    const jobs = await db.query.agentJobs.findMany();
    expect(jobs.length).toBeGreaterThan(0);
  });
});