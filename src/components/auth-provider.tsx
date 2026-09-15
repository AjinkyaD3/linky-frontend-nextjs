"use client";

import { useEffect, useRef } from "react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

/** Silently exchanges a persisted refresh token for a fresh access token on
 * first load, since the access token itself is never persisted. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const { refreshToken, accessToken, setSession, user, setHydrated, clear } =
      useAuthStore.getState();

    if (!refreshToken || accessToken) {
      setHydrated();
      return;
    }

    authApi
      .refresh(refreshToken)
      .then((data) => {
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: user ?? { name: data.name, email: data.email, role: data.role },
        });
      })
      .catch(() => {
        clear();
      })
      .finally(() => {
        setHydrated();
      });
  }, []);

  return <>{children}</>;
}
