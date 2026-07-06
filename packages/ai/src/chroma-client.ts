import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { HuggingFaceTransformersEmbeddingFunction } from "chromadb";

export class ChromaDBClient {
  private client: ChromaClient;
  private embeddingFunction: HuggingFaceTransformersEmbeddingFunction;

  constructor() {
    this.client = new ChromaClient({
      host: process.env.CHROMADB_URL || "http://localhost:8000",
    });

    this.embeddingFunction = new HuggingFaceTransformersEmbeddingFunction({
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });
  }

  async getOrCreateCollection(name: string) {
    return await this.client.getOrCreateCollection({
      name,
      embeddingFunction: this.embeddingFunction,
      metadata: { "hnsw:space": "cosine" },
    });
  }

  async addDocuments(
    collectionName: string,
    documents: { id: string; text: string; metadata?: Record<string, any> }[]
  ) {
    const collection = await this.getOrCreateCollection(collectionName);

    await collection.upsert({
      ids: documents.map((d) => d.id),
      documents: documents.map((d) => d.text),
      metadatas: documents.map((d) => d.metadata || {}),
    });
  }

  async search(
    collectionName: string,
    query: string,
    k: number = 5
  ): Promise<
    {
      id: string;
      text: string;
      metadata: Record<string, any>;
      distance: number;
    }[]
  > {
    const collection = await this.getOrCreateCollection(collectionName);

    const results = await collection.query({
      queryTexts: [query],
      nResults: k,
    });

    return (results.documents[0] || []).map((doc, index) => ({
      id: results.ids[0][index],
      text: doc,
      metadata: results.metadatas[0][index] || {},
      distance: results.distances[0][index] || 0,
    }));
  }

  async deleteCollection(name: string) {
    await this.client.deleteCollection({ name });
  }
}

export const chromaClient = new ChromaDBClient();