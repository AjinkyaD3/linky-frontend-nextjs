"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { KeyRound, LayoutDashboard, Link2, Menu, Settings, ShieldCheck, Tag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/links", label: "Links", icon: Link2 },
  { href: "/tags", label: "Tags", icon: Tag },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ role }: { role?: Role }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-foreground hover:bg-muted md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Logo />
            <DialogPrimitive.Close className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] hover:bg-muted">
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-accent/15 text-accent-hover dark:text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            {role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ShieldCheck className="size-4" />
                Admin
              </Link>
            )}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
