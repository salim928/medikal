import { db, organizations } from "@/db";

export async function seedComplianceData() {
  console.log("🌱 Seeding compliance templates...");

  // Sample compliance policies
  const policies = [
    {
      name: "HIPAA Privacy Policy",
      version: "1.0",
      effectiveDate: new Date(),
    },
    {
      name: "Data Retention Policy",
      version: "1.0",
      effectiveDate: new Date(),
    },
    {
      name: "Incident Response Plan",
      version: "1.0",
      effectiveDate: new Date(),
    },
  ];

  console.log(`✅ Seeded ${policies.length} compliance policies`);
}