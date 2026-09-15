import { BarChart3, Lock, QrCode, Timer } from "lucide-react";
import Link from "next/link";
import { QuickShorten } from "@/components/home/quick-shorten";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

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

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      <main className="flex flex-1 flex-col items-center px-4 py-20 text-center md:py-28">
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

        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
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
      </main>

      <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        Linky — built for security and analytics, not just link compression.
      </footer>
    </div>
  );
}
