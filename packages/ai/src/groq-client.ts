import Groq from "groq-sdk";

export class GroqClient {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateCompletion(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    } = {}
  ) {
    const startTime = Date.now();

    const response = await this.client.chat.completions.create({
      model: options.model || "mixtral-8x7b-32768",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      top_p: options.topP ?? 1,
    });

    const latencyMs = Date.now() - startTime;
    const tokensUsed =
      (response.usage?.total_tokens || 0) +
      (response.usage?.completion_tokens || 0);

    return {
      content: response.choices[0]?.message?.content || "",
      tokensUsed,
      latencyMs,
      model: response.model,
      cost: 0, // Free tier
    };
  }

  async parseJSON<T>(prompt: string, schema?: object): Promise<T> {
    const response = await this.generateCompletion(
      `${prompt}\n\nRespond only with valid JSON.`,
      { temperature: 0 }
    );

    try {
      return JSON.parse(response.content);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error}`);
    }
  }
}

export const groqClient = new GroqClient();