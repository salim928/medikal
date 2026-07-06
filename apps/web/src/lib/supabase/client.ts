/**
 * Browser-side Supabase client.
 *
 * Uses @supabase/ssr so the auth session is stored in cookies (not localStorage).
 * This is what lets the server (route handlers, middleware, RSC) see the logged-in
 * user — the old raw createClient() kept the session in localStorage, which the
 * server can never read, so every authenticated API call returned 401.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when a Supabase backend is configured; demo mode works without one. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Demo mode does not need it — check isSupabaseConfigured before calling."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: timeoutFetch },
  });
}

// Lazy singleton via Proxy: importing this module never throws — only actually
// touching the client without configuration does. Demo mode imports it freely.
let _client: SupabaseClient | null = null;
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) _client = createClient();
    return Reflect.get(_client, prop, _client);
  },
});
