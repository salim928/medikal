/**
 * Seeds demo accounts into Supabase using the public anon key (normal signup flow).
 * Role is stored in user metadata; getUserRoleFromDB falls back to it.
 * Run: node scripts/seed-demo.mjs   (from apps/web)
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) =>
  (env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1] || "").trim().replace(/^["']|["']$/g, "");

const url = get("NEXT_PUBLIC_SUPABASE_URL");
const anon = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
if (!url || !anon) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / ANON_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(url, anon, { auth: { persistSession: false } });
const PW = "Demo1234!";
const users = [
  ["patient@mediconnect.demo", "Patient", "patient"],
  ["doctor@mediconnect.demo", "Doctor", "doctor"],
  ["nurse@mediconnect.demo", "Nurse", "nurse"],
  ["midwife@mediconnect.demo", "Midwife", "midwife"],
  ["lawyer@mediconnect.demo", "Lawyer", "lawyer"],
];

let anyNeedsConfirm = false;

for (const [email, name, role] of users) {
  const { data, error } = await sb.auth.signUp({
    email,
    password: PW,
    options: { data: { role, full_name: `Demo ${name}`, name: `Demo ${name}` } },
  });
  if (error) {
    console.log(`• ${email.padEnd(30)} signup: ${error.message}`);
  } else {
    const confirmed = !!(data.user?.email_confirmed_at || data.user?.confirmed_at);
    console.log(
      `• ${email.padEnd(30)} created  session=${!!data.session}  confirmed=${confirmed}`
    );
    if (!data.session && !confirmed) anyNeedsConfirm = true;
  }
}

// Verify login works end-to-end for the patient.
const { data: login, error: loginErr } = await sb.auth.signInWithPassword({
  email: "patient@mediconnect.demo",
  password: PW,
});
console.log("\nLogin test (patient):", loginErr ? `FAILED — ${loginErr.message}` : "OK ✅");

if (anyNeedsConfirm) {
  console.log(
    "\n⚠ Email confirmation appears to be ON. Disable it in Supabase → Authentication → Providers → Email → 'Confirm email' (off), or confirm the addresses, then these will log in."
  );
}
