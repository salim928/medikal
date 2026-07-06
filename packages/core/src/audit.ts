import { db, agentJobs, consentLogs } from "@/db";
import { blockchainClient } from "@/blockchain";

export interface AuditEvent {
  action: string;
  userId: string;
  resourceId: string;
  resourceType: string;
  details: Record<string, any>;
  timestamp: Date;
}

export class AuditService {
  /**
   * Log action to database and blockchain
   */
  static async logAction(event: AuditEvent): Promise<void> {
    try {
      // Log to database
      await db.insert(consentLogs).values({
        id: crypto.randomUUID(),
        patientId: event.userId,
        consentType: "data_processing" as any,
        action: event.action,
        scope: `${event.resourceType}:${event.resourceId}`,
        createdBy: event.userId,
        createdAt: event.timestamp,
      });

      // Log to blockchain for immutability
      const hash = await this.hashEvent(event);
      const txHash = await blockchainClient.logAction(event.action, hash);

      console.log(`Audit logged: ${event.action} (tx: ${txHash})`);
    } catch (error) {
      console.error("Audit logging failed:", error);
      // Don't throw - audit failure shouldn't break the application
    }
  }

  /**
   * Hash event for blockchain
   */
  private static async hashEvent(event: AuditEvent): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(event));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Retrieve audit logs
   */
  static async getAuditTrail(resourceId: string, limit: number = 100) {
    try {
      const logs = await db.query.consentLogs.findMany({
        limit,
      });

      return logs;
    } catch (error) {
      console.error("Failed to retrieve audit trail:", error);
      return [];
    }
  }
}