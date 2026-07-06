import { groqClient } from "./groq-client";
import { chromaClient } from "./chroma-client";

export interface RAGResult {
  content: string;
  citations: Citation[];
  tokensUsed: number;
  latencyMs: number;
  model: string;
}

export interface Citation {
  id: string;
  source: string;
  relevance: number;
  excerpt: string;
}

export class RAGPipeline {
  async retrieve(
    query: string,
    collectionName: string,
    k: number = 5
  ): Promise<Citation[]> {
    const results = await chromaClient.search(collectionName, query, k);

    return results.map((result) => ({
      id: result.id,
      source: result.metadata.source || "Unknown",
      relevance: Math.max(0, 1 - result.distance), // Convert distance to relevance
      excerpt: result.text,
    }));
  }

  async generate(
    query: string,
    citations: Citation[],
    systemPrompt: string
  ): Promise<RAGResult> {
    const context = citations
      .map(
        (c, i) =>
          `[${i + 1}] ${c.source}: ${c.excerpt} (Relevance: ${(c.relevance * 100).toFixed(1)}%)`
      )
      .join("\n");

    const prompt = `${systemPrompt}

CONTEXT:
${context}

QUERY: ${query}

Provide a comprehensive response with citations (e.g., [1], [2]).`;

    const result = await groqClient.generateCompletion(prompt, {
      temperature: 0.5,
      maxTokens: 2048,
    });

    return {
      content: result.content,
      citations,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs,
      model: result.model,
    };
  }

  async end2end(
    query: string,
    collectionName: string,
    systemPrompt: string,
    k: number = 5
  ): Promise<RAGResult> {
    const citations = await this.retrieve(query, collectionName, k);
    const relevant = citations.filter((c) => c.relevance > 0.7);

    if (relevant.length === 0) {
      return {
        content: "No relevant information found in the knowledge base.",
        citations: [],
        tokensUsed: 0,
        latencyMs: 0,
        model: "unknown",
      };
    }

    return this.generate(query, relevant, systemPrompt);
  }
}

export const ragPipeline = new RAGPipeline();