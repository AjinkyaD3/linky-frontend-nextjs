import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          This link goes nowhere.
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you were looking for doesn&apos;t exist. If you followed a short link, it
          may have expired, been used already, or been deleted by its owner.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
