/**
 * FRESH MEDICONNECT AUTHENTICATION LIBRARY
 * Clean, simple, production-ready authentication
 */

import type { User, Session, AuthError } from "@supabase/supabase-js";

// Cookie-backed browser client (@supabase/ssr). The session lives in cookies so the
// server (middleware + API route handlers) can read it. Previously this used a raw
// localStorage client, which the server could never see — so login appeared to work
// but every protected route/API still treated the user as logged out.
export { supabase } from "./supabase/client";
import { supabase } from "./supabase/client";

// User role type
export type UserRole = "patient" | "doctor" | "nurse" | "midwife" | "lawyer";

// Authentication result type
export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign up a new user with role-specific metadata
 */
export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  fullName: string,
  metadata?: Record<string, any>
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          ...metadata,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { user: null, session: null, error };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: error as AuthError,
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: error as AuthError,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    return { session: null, error: error as AuthError };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

/**
 * Get user role from metadata (DEPRECATED - use getUserRoleFromDB)
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return "patient";
  return (user.user_metadata?.role as UserRole) || "patient";
}

/**
 * Get user role from database using Postgres function (bypasses RLS)
 * This is the correct method - roles are stored in the database, not metadata
 */
const VALID_ROLES: UserRole[] = ["patient", "doctor", "nurse", "midwife", "lawyer"];

function normalizeRole(value: unknown): UserRole | null {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : null;
}

export async function getUserRoleFromDB(userId: string): Promise<UserRole> {
  // 1. Try the Postgres get_user_role function (source of truth when present).
  try {
    const { data, error } = await supabase.rpc("get_user_role", {
      user_id_param: userId,
    });
    if (!error) {
      const fromDb = normalizeRole(data);
      if (fromDb) return fromDb;
    }
  } catch {
    // RPC missing or failed — fall through to metadata.
  }

  // 2. Fall back to the role stored in the user's auth metadata (set at signup).
  //    Keeps demo/self-service accounts working even without the roles tables.
  try {
    const { data } = await supabase.auth.getUser();
    const fromMeta = normalizeRole(data.user?.user_metadata?.role);
    if (fromMeta) return fromMeta;
  } catch {
    // ignore
  }

  return "patient";
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession();
  return !!session;
}

/**
 * Reset password request
 */
export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
}

/**
 * Update password
 */
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  metadata: Record<string, any>
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: metadata,
    });
    return { error };
  } catch (error) {
    return { error: error as AuthError };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): { unsubscribe: () => void } {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}
