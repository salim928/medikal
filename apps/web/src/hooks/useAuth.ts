"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/auth-fresh";
import { getDemoRole, demoUser } from "@/lib/demo";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo mode: cookie-based session, no backend.
    const demoRole = getDemoRole();
    if (demoRole) {
      setUser(demoUser(demoRole) as unknown as User);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}