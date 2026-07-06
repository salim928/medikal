/**
 * FRESH MEDICONNECT AUTH HOOK
 * Clean, simple authentication state management
 */

"use client";

import { useState, useEffect } from "react";
import { supabase, getUserRoleFromDB, type UserRole } from "@/lib/auth-fresh";
import { getDemoRole, demoUser } from "@/lib/demo";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("patient");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Demo mode: use the cookie-based demo session (no backend).
    const demoRole = getDemoRole();
    if (demoRole) {
      setUser(demoUser(demoRole) as unknown as User);
      setRole(demoRole);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // Get initial session and fetch role from database
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Fetch role from database (not metadata!)
      if (currentUser) {
        const dbRole = await getUserRoleFromDB(currentUser.id);
        setRole(dbRole);
      } else {
        setRole("patient");
      }
      
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Fetch role from database (not metadata!)
      if (currentUser) {
        const dbRole = await getUserRoleFromDB(currentUser.id);
        setRole(dbRole);
      } else {
        setRole("patient");
      }
      
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    role,
    loading,
    isAuthenticated,
  };
}
