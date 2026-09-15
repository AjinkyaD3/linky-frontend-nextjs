import * as React from "react";
import { cn } from "@/lib/utils";

/** Bordered monospace chip used for short codes, links, and API keys - the
 * product's recurring "this is a code" visual motif. */
function CodeChip({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-muted px-2 py-1 font-mono text-[13px] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { CodeChip };
