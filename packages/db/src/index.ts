export * from "./schema";
export { db } from "./client";
export { runMigrations } from "./migrations";

// Enable RLS on sensitive tables
export const RLS_POLICIES = {
  medical_records: `
    CREATE POLICY patients_own_data ON medical_records
    USING (patient_id = auth.uid())
    WITH CHECK (patient_id = auth.uid());
  `,
  appointments: `
    CREATE POLICY users_own_appointments ON appointments
    USING (patient_id = auth.uid() OR provider_id = auth.uid())
    WITH CHECK (patient_id = auth.uid() OR provider_id = auth.uid());
  `,
  prescriptions: `
    CREATE POLICY users_own_prescriptions ON prescriptions
    USING (patient_id = auth.uid() OR provider_id = auth.uid())
    WITH CHECK (patient_id = auth.uid() OR provider_id = auth.uid());
  `,
};