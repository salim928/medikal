/**
 * medicom auth hook — demo cookie session or Supabase, one interface.
 *
 * Implemented as a tiny external store consumed via useSyncExternalStore:
 *  - during SSR/hydration every component sees the same unresolved snapshot
 *    (no hydration mismatches),
 *  - the session resolves once per page load (synchronously for the demo
 *    cookie), and every later client-side navigation reads it instantly —
 *    no spinner flash on every click.
 */

"use client";

import { useSyncExternalStore } from "react";
import { supabase, getUserRoleFromDB, type UserRole } from "@/lib/auth-fresh";
import { getDemoRole, demoUser } from "@/lib/demo";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthSnapshot {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
}

const UNRESOLVED: AuthSnapshot = {
  user: null,
  role: "patient",
  isAuthenticated: false,
  loading: true,
};

let snapshot: AuthSnapshot = UNRESOLVED;
let started = false;
let authSubscription: { unsubscribe: () => void } | null = null;
const listeners = new Set<() => void>();

function emit(next: AuthSnapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}

function resolveSession() {
  if (started) return;
  started = true;

  // Demo mode: cookie-based session, resolved synchronously.
  const demoRole = getDemoRole();
  if (demoRole) {
    emit({
      user: demoUser(demoRole) as unknown as User,
      role: demoRole,
      isAuthenticated: true,
      loading: false,
    });
    return;
  }

  // No backend configured and no demo cookie → unauthenticated.
  if (!isSupabaseConfigured) {
    emit({ user: null, role: "patient", isAuthenticated: false, loading: false });
    return;
  }

  // Real backend: resolve the Supabase session + role.
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    const user = session?.user ?? null;
    const role = user ? await getUserRoleFromDB(user.id) : "patient";
    emit({ user, role, isAuthenticated: !!user, loading: false });
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user ?? null;
    const role = user ? await getUserRoleFromDB(user.id) : "patient";
    emit({ user, role, isAuthenticated: !!user, loading: false });
  });
  authSubscription = subscription;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  resolveSession();
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => UNRESOLVED;

export function useAuth(): AuthSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Call on sign-out so the next mount re-resolves the session. */
export function clearAuthCache() {
  authSubscription?.unsubscribe();
  authSubscription = null;
  started = false;
  snapshot = UNRESOLVED;
  resolveSession();
}
