import { ethers } from "ethers";
import ConsentRegistryABI from "./abis/ConsentRegistry.json";
import AuditLogABI from "./abis/AuditLog.json";

export class BlockchainClient {
  private provider: ethers.Provider;
  private signer: ethers.Wallet;
  private consentRegistry: ethers.Contract;
  private auditLog: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);

    this.consentRegistry = new ethers.Contract(
      process.env.CONSENT_REGISTRY_ADDRESS!,
      ConsentRegistryABI,
      this.signer
    );

    this.auditLog = new ethers.Contract(
      process.env.AUDIT_LOG_ADDRESS!,
      AuditLogABI,
      this.signer
    );
  }

  async grantConsent(
    provider: string,
    scope: string,
    durationSeconds: number,
    ipfsHash: string
  ): Promise<string> {
    try {
      const tx = await this.consentRegistry.grantConsent(
        provider,
        scope,
        durationSeconds,
        ethers.id(ipfsHash)
      );

      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Grant consent error:", error);
      throw error;
    }
  }

  async revokeConsent(provider: string): Promise<string> {
    try {
      const tx = await this.consentRegistry.revokeConsent(provider);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Revoke consent error:", error);
      throw error;
    }
  }

  async logAction(action: string, resourceHash: string): Promise<string> {
    try {
      const tx = await this.auditLog.log(action, ethers.id(resourceHash));
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Log action error:", error);
      throw error;
    }
  }

  async getAuditLogs(offset: number = 0, limit: number = 50) {
    try {
      return await this.auditLog.getLogs(offset, limit);
    } catch (error) {
      console.error("Get audit logs error:", error);
      throw error;
    }
  }
}

export const blockchainClient = new BlockchainClient();