import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "patient" | "provider" | "admin" | "clinic_staff";
  profilePictureUrl?: string;
  bio?: string;
  orgId?: string;
}

interface UserStore {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clear: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  clear: () => set({ user: null, loading: false }),
}));