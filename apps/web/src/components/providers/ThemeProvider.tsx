"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/lib/theme";

/**
 * ThemeProvider - Applies role-based theme to the entire app
 * Sets CSS variables based on user role for consistent theming
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && role) {
      const roleTheme = theme.roles[role];
      
      // Set CSS custom properties for dynamic theming
      document.documentElement.style.setProperty('--color-primary', roleTheme.primary);
      document.documentElement.style.setProperty('--color-secondary', roleTheme.secondary);
      document.documentElement.style.setProperty('--color-light', roleTheme.light);
      document.documentElement.style.setProperty('--color-dark', roleTheme.dark);
      
      // Add role class to body for conditional styling
      document.body.classList.remove('role-patient', 'role-doctor', 'role-nurse', 'role-midwife', 'role-lawyer');
      document.body.classList.add(`role-${role}`);
    }
  }, [role, isAuthenticated]);

  return <>{children}</>;
}
