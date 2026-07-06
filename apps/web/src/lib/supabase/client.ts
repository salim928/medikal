/**
 * Browser-side Supabase client.
 *
 * Uses @supabase/ssr so the auth session is stored in cookies (not localStorage).
 * This is what lets the server (route handlers, middleware, RSC) see the logged-in
 * user — the old raw createClient() kept the session in localStorage, which the
 * server can never read, so every authenticated API call returned 401.
 */
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Check .env.local."
  );
}

// Fetch with a hard timeout so a slow/unreachable backend fails fast instead of
// hanging the UI (important while the app has no live Supabase project).
const timeoutFetch: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 6000);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  );
};

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: timeoutFetch },
  });
}

// Singleton browser client for convenience (safe: createBrowserClient is memoized per params).
export const supabase = createClient();
