"use client";

import { RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Renders inside the root layout, so it keeps the
 * theme/providers and only replaces the page content.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the browser console and in the server logs via the digest —
    // the message itself is never rendered, so internals stay out of the UI.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Something went wrong.
        </h1>
        <p className="max-w-md text-muted-foreground">
          We hit an unexpected error while loading this page. Try again — if it keeps
          happening, the service may be temporarily unavailable.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCw className="size-4" />
          Try again
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
