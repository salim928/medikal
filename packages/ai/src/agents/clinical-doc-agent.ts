import { ragPipeline } from "../rag-pipeline";

export interface ClinicalDocInput {
  appointmentId: string;
  chiefComplaint: string;
  patientHistory: string;
  examination: string;
  vitals: Record<string, any>;
}

export interface ClinicalDocOutput {
  assessment: string;
  plan: string;
  icd10Codes: string[];
  cptCodes: string[];
  citations: Array<{ source: string; text: string }>;
}

const CLINICAL_DOC_PROMPT = `You are an experienced clinical documentation specialist. Create a comprehensive clinical assessment and plan.

Provide:
1. Concise assessment of patient condition
2. Detailed treatment plan
3. Relevant ICD-10 diagnosis codes
4. Relevant CPT procedure codes

Format as JSON:
{
  "assessment": "...",
  "plan": "...",
  "icd10Codes": ["code1", "code2"],
  "cptCodes": ["code1", "code2"]
}`;

export async function clinicalDocAgent(
  input: ClinicalDocInput
): Promise<ClinicalDocOutput> {
  const query = `${input.chiefComplaint} with exam findings: ${input.examination}`;

  const ragResult = await ragPipeline.end2end(
    query,
    "clinical_guidelines",
    CLINICAL_DOC_PROMPT,
    5
  );

  return JSON.parse(ragResult.content);
}