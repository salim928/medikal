import { groqClient } from "../groq-client";

export interface RedFlagInput {
  symptoms: string;
  vitals: Record<string, any>;
  medications: string[];
  allergies: string[];
  pastConditions: string[];
}

export interface RedFlagOutput {
  hasCriticalFlags: boolean;
  flags: Array<{
    flag: string;
    severity: "warning" | "critical";
    action: string;
  }>;
}

const RED_FLAG_PROMPT = `Analyze for critical medical red flags that require immediate escalation.

Look for:
- Life-threatening conditions (MI, stroke, sepsis, anaphylaxis)
- Dangerous drug interactions
- Contraindications
- Urgent conditions requiring ER visit

Respond in JSON:
{
  "hasCriticalFlags": boolean,
  "flags": [
    {"flag": "description", "severity": "warning|critical", "action": "recommended action"}
  ]
}`;

export async function redFlagAgent(
  input: RedFlagInput
): Promise<RedFlagOutput> {
  const prompt = `
Symptoms: ${input.symptoms}
Vitals: ${JSON.stringify(input.vitals)}
Current Medications: ${input.medications.join(", ")}
Allergies: ${input.allergies.join(", ")}
Past Conditions: ${input.pastConditions.join(", ")}

${RED_FLAG_PROMPT}`;

  const response = await groqClient.parseJSON<RedFlagOutput>(prompt);

  if (response.hasCriticalFlags) {
    console.error(
      "RED FLAG ALERT:",
      response.flags.map((f) => f.flag).join("; ")
    );
  }

  return response;
}