/**
 * Single source of truth for the public-facing site identity (canonical URL,
 * naming, social metadata). Anything that ends up in a <meta> tag, sitemap,
 * manifest or JSON-LD block should read from here rather than hardcoding.
 */
export const siteConfig = {
  name: "Linky",
  /** Used for <title> templates and OG site_name. */
  title: "Linky — short links, done right",
  description:
    "Password-protected links, one-time links, QR codes, and real click analytics.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://linky.ajinkyadhotre.com").replace(
    /\/$/,
    ""
  ),
  locale: "en_US",
  twitter: "@ajinkyad3",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
