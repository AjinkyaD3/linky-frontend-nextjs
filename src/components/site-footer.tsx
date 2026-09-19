import Link from "next/link";

const LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  {
    href: "https://github.com/AjinkyaD3/linky-frontend-nextjs",
    label: "Source",
    external: true,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} Linky. Built for security and analytics, not
          just link compression.
        </p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-[var(--radius-sm)] underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
