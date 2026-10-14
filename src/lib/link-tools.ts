import type { RoutingRule } from "./types";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/** Appends utm_* parameters to a URL, keeping existing query parameters. Returns the input unchanged if no UTM value is set. */
export function applyUtm(rawUrl: string, utm: UtmParams): string {
  const entries = Object.entries(utm).filter(([, v]) => v && v.trim());
  if (entries.length === 0) return rawUrl;
  const url = new URL(rawUrl);
  for (const [key, value] of entries) {
    url.searchParams.set(`utm_${key}`, (value as string).trim());
  }
  return url.toString();
}

/** Value of a `datetime-local` input (local time, no zone) to an ISO-8601 instant, or undefined if empty/invalid. */
export function localInputToInstant(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** ISO instant to the local `YYYY-MM-DDTHH:mm` format a `datetime-local` input expects. */
export function instantToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG contrast ratio between two #rrggbb colours (1 to 21). QR codes need roughly 3+ to scan reliably. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Rules the user has fully filled in (others are ignored while editing). */
export function completeRules(rules: RoutingRule[]): RoutingRule[] {
  return rules
    .filter((r) => r.value.trim() && r.url.trim())
    .map((r) => ({ ...r, value: r.value.trim(), url: r.url.trim() }));
}

/** Parses pasted text (one URL per line, optionally `alias, url`) into bulk-create rows. */
export function parseBulkLines(text: string): { originalUrl: string; customAlias?: string }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const comma = line.indexOf(",");
      if (comma > 0 && !/^https?:\/\//i.test(line.slice(0, comma).trim())) {
        return { customAlias: line.slice(0, comma).trim(), originalUrl: line.slice(comma + 1).trim() };
      }
      return { originalUrl: line };
    });
}
