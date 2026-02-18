/**
 * Zustand store for auth state (client-side).
 * Synced with session cookie; used for UI (e.g. redirect when already logged in).
 */
import { create } from "zustand";

interface AuthState {
  username: string | null;
  setUser: (username: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  setUser: (username) => set({ username }),
  logout: () => set({ username: null }),
}));
