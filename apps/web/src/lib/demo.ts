/**
 * Dev-only demo auth: lets you access role dashboards without a live backend.
 * A single cookie (`mc-demo=<role>`) is honored by the middleware and the auth hook.
 * No password, no network — purely for building/previewing the UI.
 */
export const DEMO_COOKIE = "mc-demo";
export const DEMO_ROLES = ["patient", "doctor", "nurse", "midwife", "lawyer"] as const;
export type DemoRole = (typeof DEMO_ROLES)[number];

export function isDemoRole(v: unknown): v is DemoRole {
  return typeof v === "string" && (DEMO_ROLES as readonly string[]).includes(v);
}

/* ------------------------------- browser ------------------------------- */

export function setDemoSession(role: DemoRole) {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_COOKIE}=${role}; path=/; max-age=86400; samesite=lax`;
}

export function clearDemoSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function getDemoRole(): DemoRole | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${DEMO_COOKIE}=([^;]+)`));
  return m && isDemoRole(m[1]) ? m[1] : null;
}

/** A minimal Supabase-User-shaped object for demo sessions. */
export function demoUser(role: DemoRole) {
  const name = `Demo ${role.charAt(0).toUpperCase()}${role.slice(1)}`;
  return {
    id: `demo-${role}`,
    email: `${role}@medicom.demo`,
    user_metadata: { role, full_name: name, name },
    app_metadata: { provider: "demo" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };
}
