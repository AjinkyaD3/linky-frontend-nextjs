import { BarChart3, Lock, QrCode, Timer } from "lucide-react";
import Link from "next/link";
import { QuickShorten } from "@/components/home/quick-shorten";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const FEATURES = [
  {
    icon: Lock,
    title: "Password protection",
    description: "Lock any link behind a password so only the right people get through.",
  },
  {
    icon: Timer,
    title: "One-time links",
    description: "Links that self-destruct after a single click — perfect for sensitive shares.",
  },
  {
    icon: QrCode,
    title: "QR codes, built in",
    description: "Every link gets a downloadable QR code automatically. No extra tools.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    description: "Browser, OS, device, and location breakdowns for every click.",
  },
];

/**
 * Structured data for the landing page. Kept as a plain object so the copy
 * cannot drift from `siteConfig`, and injected as a single JSON-LD script.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#app`,
      name: siteConfig.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      url: siteConfig.url,
      description: siteConfig.description,
      featureList: FEATURES.map((feature) => feature.title),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        // Static, build-time constant — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to content
      </a>
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main id="main" className="flex flex-1 flex-col items-center px-4 py-20 text-center md:py-28">
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
          Short links, done <span className="text-accent">properly</span>.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Password-protected links, one-time shares, QR codes, and real click analytics —
          not just a redirect.
        </p>

        <div className="mt-8 flex justify-center">
          <QuickShorten />
        </div>

        <section aria-labelledby="features-heading" className="mt-24 w-full max-w-4xl">
          <h2 id="features-heading" className="sr-only">
            What Linky does
          </h2>
          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent/15 text-accent-hover dark:text-accent">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
