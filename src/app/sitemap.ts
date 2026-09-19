import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Only public, indexable pages belong here. */
const ROUTES: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/login", priority: 0.5, changeFrequency: "yearly" },
  { path: "/register", priority: 0.8, changeFrequency: "yearly" },
  { path: "/forgot-password", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
