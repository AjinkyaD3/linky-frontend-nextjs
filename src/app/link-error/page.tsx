"use client";

import { Clock, Link2Off, PowerOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const REASONS = {
  not_found: {
    icon: Link2Off,
    title: "This link doesn't exist",
    description: "The short link you followed doesn't point to anything we know about.",
  },
  expired: {
    icon: Clock,
    title: "This link has expired",
    description: "The owner set an expiry date on this link, and it's passed.",
  },
  inactive: {
    icon: PowerOff,
    title: "This link is no longer active",
    description:
      "It may have been a one-time link that's already been used, or was deactivated by its owner.",
  },
} as const;

function LinkErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") as keyof typeof REASONS | null;
  const info = (reason && REASONS[reason]) || REASONS.not_found;
  const Icon = info.icon;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo className="text-xl" />
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{info.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{info.description}</p>
        </div>
        <Button asChild className="mt-2 w-full">
          <Link href="/">Go to Linky</Link>
        </Button>
      </div>
    </div>
  );
}

export default function LinkErrorPage() {
  return (
    <Suspense>
      <LinkErrorContent />
    </Suspense>
  );
}
