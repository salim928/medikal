/**
 * Server-side Supabase clients (@supabase/ssr).
 *
 * - createSupabaseServerClient(): request-scoped client that reads/writes the auth
 *   cookies, for use in Route Handlers and Server Components.
 * - createSupabaseAdminClient(): service-role client that BYPASSES RLS. Server-only.
 *   Use for trusted server work like webhook fulfillment. Never import in client code.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore; middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses Row Level Security — server-side only.
 * Returns null if the service role key isn't configured (so callers can degrade gracefully).
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
