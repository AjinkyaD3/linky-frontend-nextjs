import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

/** Shared chrome for the standalone legal pages, so they match the landing page. */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated{" "}
          <time dateTime={lastUpdated}>
            {new Date(lastUpdated).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_a]:text-accent-hover [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-accent [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
