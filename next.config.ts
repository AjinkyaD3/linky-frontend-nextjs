import type { NextConfig } from "next";

/**
 * The backend the browser talks to directly. It has to be named explicitly in
 * `connect-src` / `img-src`, because it is a different origin from the site
 * (avatars and QR codes are served from it).
 */
const apiOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

/**
 * Content-Security-Policy.
 *
 * `script-src` and `style-src` still need 'unsafe-inline': Next.js injects an
 * inline bootstrap script, next-themes injects an inline no-flash script, and
 * Tailwind/Next emit inline style attributes. Tightening those to nonces means
 * a middleware that generates a per-request nonce, which would opt every page
 * out of static rendering — not worth it for this app. Everything else is
 * locked down.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `img-src 'self' data: blob:${apiOrigin ? ` ${apiOrigin}` : ""}`,
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ""}`,
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HSTS: 2 years, subdomains included. Only ever honoured over HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version to every visitor.
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
