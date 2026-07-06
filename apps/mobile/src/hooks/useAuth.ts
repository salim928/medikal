import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/auth";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Auth error"));
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Sign in failed"));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Sign up failed"));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"));
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}