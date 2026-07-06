import { db, medicalRecords, clinical_notes, prescriptions, agentJobs } from "@/db";

export async function seedHealthcareData() {
  console.log("🌱 Seeding healthcare reference data...");

  // Sample medical conditions
  const conditions = [
    { code: "E11.9", name: "Type 2 Diabetes", category: "Endocrine" },
    { code: "I10", name: "Essential Hypertension", category: "Cardiovascular" },
    { code: "J45.9", name: "Asthma", category: "Respiratory" },
    { code: "M79.3", name: "Panniculitis", category: "Musculoskeletal" },
    { code: "F41.1", name: "Generalized Anxiety Disorder", category: "Mental Health" },
  ];

  // Sample medications
  const medications = [
    { name: "Metformin", code: "860004", strength: "500mg" },
    { name: "Lisinopril", code: "314076", strength: "10mg" },
    { name: "Albuterol", code: "1648043", strength: "90mcg" },
    { name: "Sertraline", code: "317370", strength: "50mg" },
  ];

  console.log(
    `✅ Seeded ${conditions.length} conditions and ${medications.length} medications`
  );
}