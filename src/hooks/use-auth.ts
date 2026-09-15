"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const cachedUser = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["me"],
    queryFn: userApi.me,
    enabled: !!accessToken,
    initialData: cachedUser
      ? {
          id: 0,
          name: cachedUser.name,
          email: cachedUser.email,
          role: cachedUser.role,
        }
      : undefined,
    staleTime: 60_000,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshToken, clear } = useAuthStore.getState();

  return async () => {
    if (refreshToken) {
      try {
        const { authApi } = await import("@/lib/api");
        await authApi.logout(refreshToken);
      } catch {
        // best-effort; still clear local state below
      }
    }
    clear();
    queryClient.clear();
    router.push("/login");
  };
}
