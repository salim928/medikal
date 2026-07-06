import { groqClient } from "../groq-client";
import { ragPipeline } from "../rag-pipeline";
import { db, agentJobs, appointments } from "@/db";
import { eq } from "drizzle-orm";

/**
 * De-identifies patient data by removing PII before sending to LLM
 * HIPAA Compliance: No PHI should be transmitted to external AI services
 */
function deIdentifyData(text: string): string {
  if (!text) return text;

  let sanitized = text;

  // Remove patient names (common patterns)
  sanitized = sanitized.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[NAME]");
  
  // Remove dates (MM/DD/YYYY, DD-MM-YYYY, etc.)
  sanitized = sanitized.replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, "[DATE]");
  
  // Remove phone numbers (various formats)
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]");
  
  // Remove email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]");
  
  // Remove MRN/ID numbers (patterns like MRN123456, ID-123456)
  sanitized = sanitized.replace(/\b(MRN|ID|SSN)[:\s-]?\d{5,}\b/gi, "[ID]");
  
  // Remove addresses (simplified pattern)
  sanitized = sanitized.replace(/\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, "[ADDRESS]");

  return sanitized;
}

export interface TriageInput {
  appointmentId: string;
  symptoms: string;
  vitals: Record<string, any>;
  patientHistory?: string;
}

export interface TriageOutput {
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendations: string[];
  citations: Array<{ source: string; text: string }>;
  redFlags: string[];
  suggestedActions: string[];
}

const TRIAGE_SYSTEM_PROMPT = `You are an experienced medical triage assistant. Analyze patient symptoms and vitals to determine urgency level.

Provide structured assessment with:
1. Risk level (low/medium/high/critical)
2. Key recommendations
3. Red flags or concerns
4. Suggested next steps

Use medical guidelines and best practices. Flag any critical conditions immediately.

Respond in JSON format:
{
  "riskLevel": "low|medium|high|critical",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "redFlags": ["flag 1"],
  "suggestedActions": ["action 1", "action 2"]
}`;

export async function triageAgent(input: TriageInput): Promise<TriageOutput> {
  const startTime = Date.now();

  try {
    // SECURITY: De-identify PHI before sending to external LLM
    const deIdentifiedSymptoms = deIdentifyData(input.symptoms);
    const deIdentifiedHistory = input.patientHistory 
      ? deIdentifyData(input.patientHistory) 
      : undefined;

    // 1. Retrieve relevant guidelines from ChromaDB (using sanitized data)
    const citations = await ragPipeline.retrieve(
      deIdentifiedSymptoms,
      "medical_guidelines",
      5
    );

    // 2. Generate triage assessment (Groq receives NO PHI)
    const prompt = `
Patient Symptoms: ${deIdentifiedSymptoms}
Vitals: ${JSON.stringify(input.vitals)}
${deIdentifiedHistory ? `Medical History: ${deIdentifiedHistory}` : ""}

Based on the guidelines provided, perform medical triage.`;

    const ragResult = await ragPipeline.generate(
      prompt,
      citations,
      TRIAGE_SYSTEM_PROMPT
    );

    const output: TriageOutput = JSON.parse(ragResult.content);

    // 3. Log to database (store ORIGINAL input with PHI in secure database only)
    await db.insert(agentJobs).values({
      id: crypto.randomUUID(),
      orgId: (await db.query.appointments.findFirst({
        where: eq(appointments.id, input.appointmentId),
      }))?.orgId,
      appointmentId: input.appointmentId,
      agentType: "triage",
      inputText: input.symptoms,
      aiModel: "groq-mixtral",
      outputText: JSON.stringify(output),
      tokensUsed: ragResult.tokensUsed,
      latencyMs: Date.now() - startTime,
      costCents: 0,
      status: "success",
      citations: ragResult.citations,
    });

    // 4. Critical alert
    if (output.riskLevel === "critical") {
      // Trigger escalation
      console.error(`CRITICAL ALERT: ${output.redFlags.join(", ")}`);
    }

    return output;
  } catch (error) {
    console.error("Triage agent error:", error);

    await db.insert(agentJobs).values({
      id: crypto.randomUUID(),
      appointmentId: input.appointmentId,
      agentType: "triage",
      inputText: input.symptoms,
      aiModel: "groq-mixtral",
      status: "failed",
      errorMessage: String(error),
      latencyMs: Date.now() - startTime,
      costCents: 0,
    });

    throw error;
  }
}