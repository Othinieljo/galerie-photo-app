"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
  
/** Hydrates auth state from session cookie on mount */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        const data = await res.json();
        if (data.user) setUser(data.user);
        else logout();
      } catch {
        logout();
      }
    };
    checkSession();
  }, [setUser, logout]);

  return <>{children}</>;
}
