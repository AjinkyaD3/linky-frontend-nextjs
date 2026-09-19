import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Everything behind auth, plus the short-link handling routes, is
        // per-user or single-use — there is nothing there worth indexing.
        disallow: [
          "/dashboard",
          "/links",
          "/tags",
          "/api-keys",
          "/settings",
          "/admin",
          "/unlock/",
          "/link-error",
          "/reset-password",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
