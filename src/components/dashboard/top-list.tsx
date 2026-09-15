import type { TopItem } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function TopList({ title, items }: { title: string; items: TopItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">No data yet</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.slice(0, 6).map((item) => (
            <li key={item.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{item.name || "Unknown"}</span>
                <span className="text-muted-foreground">{formatNumber(item.count)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
