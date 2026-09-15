import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./types";

interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  /** true once we've attempted to rehydrate the session from a stored refresh token */
  hydrated: boolean;
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  setAccessToken: (accessToken: string) => void;
  setHydrated: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setHydrated: () => set({ hydrated: true }),
      clear: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "linky-auth",
      // The access token is short-lived and only ever kept in memory; only the
      // refresh token + a bit of user info survive a page reload.
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
