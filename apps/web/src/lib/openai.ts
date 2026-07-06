/**
 * OpenAI API Integration
 * Provides AI-powered medical assistance and symptom analysis
 */

import OpenAI from 'openai';

// Lazily created so importing this module (e.g. at build time) never requires the key.
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export interface SymptomAnalysisInput {
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

export interface SymptomAnalysisResult {
  symptoms: string[];
  possibleConditions: Array<{
    name: string;
    probability: string;
    description: string;
  }>;
  recommendedActions: string[];
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Emergency';
  recommendedSpecialist?: string;
  disclaimer: string;
}

/**
 * Analyze symptoms using OpenAI GPT-4
 */
export async function analyzeSymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisResult> {
  try {
    const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a structured assessment.

Patient Information:
- Symptoms: ${input.symptoms.join(', ')}
- Duration: ${input.duration}
- Severity: ${input.severity}
${input.age ? `- Age: ${input.age}` : ''}
${input.gender ? `- Gender: ${input.gender}` : ''}
${input.medicalHistory ? `- Medical History: ${input.medicalHistory.join(', ')}` : ''}

Please provide:
1. Top 3 possible conditions with probability percentages
2. Brief description of each condition
3. Recommended actions (3-5 items)
4. Urgency level (Low, Medium, High, or Emergency)
5. Recommended specialist type

Format your response as JSON with this structure:
{
  "possibleConditions": [
    {"name": "Condition Name", "probability": "XX%", "description": "Brief description"}
  ],
  "recommendedActions": ["Action 1", "Action 2"],
  "urgencyLevel": "Low|Medium|High|Emergency",
  "recommendedSpecialist": "Specialist Type"
}

Important: This is for informational purposes only and should not replace professional medical advice.`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a medical AI assistant providing preliminary symptom analysis. Always emphasize that this is not a diagnosis and users should consult healthcare professionals.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(responseContent);

    return {
      symptoms: input.symptoms,
      possibleConditions: analysis.possibleConditions || [],
      recommendedActions: analysis.recommendedActions || [],
      urgencyLevel: analysis.urgencyLevel || 'Medium',
      recommendedSpecialist: analysis.recommendedSpecialist,
      disclaimer:
        'This analysis is for informational purposes only and does not constitute medical advice. Please consult with a qualified healthcare professional for proper diagnosis and treatment.',
    };
  } catch (error) {
    console.error('OpenAI symptom analysis error:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

/**
 * Generate health advice using OpenAI
 */
export async function generateHealthAdvice(query: string): Promise<string> {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful medical AI assistant. Provide general health advice while always emphasizing the importance of consulting healthcare professionals for specific medical concerns.',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate advice';
  } catch (error) {
    console.error('OpenAI health advice error:', error);
    throw new Error('Failed to generate health advice');
  }
}

/**
 * Analyze medical document/report
 */
export async function analyzeMedicalDocument(
  documentText: string
): Promise<{ summary: string; keyFindings: string[]; recommendations: string[] }> {
  try {
    const prompt = `Analyze this medical document and provide:
1. A brief summary (2-3 sentences)
2. Key findings (3-5 bullet points)
3. General recommendations (if any)

Document:
${documentText}

Format as JSON:
{
  "summary": "Brief summary",
  "keyFindings": ["Finding 1", "Finding 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a medical AI assistant specializing in analyzing medical documents and reports.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 800,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(responseContent);
  } catch (error) {
    console.error('OpenAI document analysis error:', error);
    throw new Error('Failed to analyze medical document');
  }
}

/**
 * Generate prescription explanation
 */
export async function explainPrescription(
  medications: Array<{ name: string; dosage: string }>
): Promise<string> {
  try {
    const medicationList = medications
      .map((med) => `${med.name} (${med.dosage})`)
      .join(', ');

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a medical AI assistant. Explain prescriptions in simple, patient-friendly language.',
        },
        {
          role: 'user',
          content: `Explain these medications in simple terms: ${medicationList}. Include what they treat, how to take them, and common side effects.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate explanation';
  } catch (error) {
    console.error('OpenAI prescription explanation error:', error);
    throw new Error('Failed to explain prescription');
  }
}

export default {
  analyzeSymptoms,
  generateHealthAdvice,
  analyzeMedicalDocument,
  explainPrescription,
};
