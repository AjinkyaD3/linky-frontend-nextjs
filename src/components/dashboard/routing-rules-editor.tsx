"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RoutingRule, RoutingType } from "@/lib/types";

const MAX_RULES = 10;

const OPTIONS: Record<Exclude<RoutingType, "country">, string[]> = {
  device: ["mobile", "tablet", "desktop"],
  os: ["ios", "android", "windows", "macos", "linux"],
};

/** Edits a list of conditional-redirect rules: "if the visitor is X, send them to Y". First match wins. */
export function RoutingRulesEditor({
  value,
  onChange,
}: {
  value: RoutingRule[];
  onChange: (rules: RoutingRule[]) => void;
}) {
  const update = (index: number, patch: Partial<RoutingRule>) =>
    onChange(value.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No rules. Everyone goes to the destination URL.
        </p>
      )}

      {value.map((rule, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-[var(--radius-sm)] border border-border p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">If</span>
            <Select
              value={rule.type}
              onValueChange={(type) =>
                update(index, { type: type as RoutingType, value: type === "country" ? "" : OPTIONS[type as "device" | "os"][0] })
              }
            >
              <SelectTrigger className="w-28" aria-label="Rule type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="device">device</SelectItem>
                <SelectItem value="os">system</SelectItem>
                <SelectItem value="country">country</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">is</span>
            {rule.type === "country" ? (
              <Input
                className="w-20 uppercase"
                maxLength={2}
                placeholder="DE"
                aria-label="Country code"
                value={rule.value}
                onChange={(e) => update(index, { value: e.target.value.toUpperCase() })}
              />
            ) : (
              <Select value={rule.value} onValueChange={(v) => update(index, { value: v })}>
                <SelectTrigger className="w-32" aria-label="Rule value">
                  <SelectValue placeholder="choose" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIONS[rule.type].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <button
              type="button"
              aria-label="Remove rule"
              className="ml-auto text-muted-foreground hover:text-destructive"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
          <Input
            placeholder="https://… send them here instead"
            aria-label="Rule destination"
            value={rule.url}
            onChange={(e) => update(index, { url: e.target.value })}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={value.length >= MAX_RULES}
          onClick={() =>
            onChange([...value, { type: "device", value: "mobile", url: "" }])
          }
        >
          <Plus /> Add rule
        </Button>
        <p className="text-xs text-muted-foreground">
          First matching rule wins. Country rules need a CDN that sends the visitor&apos;s country.
        </p>
      </div>
    </div>
  );
}
