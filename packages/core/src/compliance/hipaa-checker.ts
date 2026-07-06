/**
 * HIPAA Compliance Utilities
 */

export class HIPAAChecker {
  /**
   * Check if data contains Protected Health Information (PHI)
   */
  static containsPHI(data: string): boolean {
    const phiPatterns = [
      /\d{3}-\d{2}-\d{4}/, // SSN
      /\d{3}-\d{2}-\d{4}/, // Tax ID
      /(\d{1,5})\s+([a-z\s]{0,40}),?\s*(?:street|st|avenue|ave|road|rd|highway|hwy|square|trail|trl|drive|dr|court|ct|parkway|pkwy|circle|cir|boulevard|blvd|route|rt|suite|ste|east|west|north|south|northeast|southeast|northwest|southwest|n|s|e|w|ne|se|nw|sw)/gi, // Addresses
      /\b\d{5}(-\d{4})?\b/, // ZIP code
      /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // Phone number
    ];

    return phiPatterns.some((pattern) => pattern.test(data));
  }

  /**
   * Redact PHI from data
   */
  static redactPHI(data: string): string {
    let redacted = data;

    // Redact SSNs
    redacted = redacted.replace(/\d{3}-\d{2}-\d{4}/g, "XXX-XX-XXXX");

    // Redact phone numbers
    redacted = redacted.replace(
      /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      "(XXX) XXX-XXXX"
    );

    // Redact ZIP codes
    redacted = redacted.replace(/\b\d{5}(-\d{4})?\b/g, "XXXXX");

    return redacted;
  }

  /**
   * Validate data retention period
   */
  static isWithinRetentionPeriod(
    dateCreated: Date,
    retentionYears: number = 6
  ): boolean {
    const expirationDate = new Date(dateCreated);
    expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);
    return new Date() <= expirationDate;
  }

  /**
   * Generate data destruction timestamp
   */
  static getDestructionDate(
    dateCreated: Date,
    retentionYears: number = 6
  ): Date {
    const destructionDate = new Date(dateCreated);
    destructionDate.setFullYear(
      destructionDate.getFullYear() + retentionYears
    );
    return destructionDate;
  }

  /**
   * Validate BAA (Business Associate Agreement) compliance
   */
  static validateBAACompliance(vendor: {
    name: string;
    hasBAA: boolean;
    BAASignedDate?: Date;
    BAAExpirationDate?: Date;
  }): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!vendor.hasBAA) {
      issues.push(`No BAA in place for ${vendor.name}`);
    }

    if (
      vendor.BAAExpirationDate &&
      new Date() > vendor.BAAExpirationDate
    ) {
      issues.push(`BAA expired for ${vendor.name}`);
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }
}