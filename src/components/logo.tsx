import { Link2 } from "lucide-react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <NextLink
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-extrabold tracking-tight text-foreground",
        className
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-foreground">
        <Link2 className="size-4" strokeWidth={2.5} />
      </span>
      <span>
        linky<span className="text-accent">.</span>
      </span>
    </NextLink>
  );
}
