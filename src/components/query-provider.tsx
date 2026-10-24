"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

/** Client errors (4xx) will not change on a retry; only retry network failures and 5xx. */
function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < 1;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Safety net: a mutation without its own onError still tells the user it failed.
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.options.onError) return;
            toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: shouldRetry,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
