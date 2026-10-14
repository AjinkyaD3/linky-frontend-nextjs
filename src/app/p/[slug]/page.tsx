import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import type { PublicPage } from "@/lib/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function getPage(slug: string): Promise<PublicPage | null> {
  const res = await fetch(`${API_URL}/api/public/pages/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not load page (${res.status})`);
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug).catch(() => null);
  if (!page) return { title: "Page not found", robots: { index: false } };
  return {
    title: page.title,
    description: page.bio ?? `Links from ${page.title}`,
    openGraph: { title: page.title, description: page.bio ?? undefined, type: "profile" },
  };
}

/** Public link-in-bio page. Server-rendered so it is fast, shareable and indexable. */
export default async function BioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center gap-6 px-4 py-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <div
          aria-hidden
          className="flex size-20 items-center justify-center rounded-full bg-accent text-3xl font-extrabold text-accent-foreground"
        >
          {page.title.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{page.title}</h1>
        {page.bio && <p className="max-w-sm text-sm text-muted-foreground">{page.bio}</p>}
      </header>

      <ul className="flex w-full flex-col gap-3">
        {page.links.map((link) => (
          <li key={link.shortCode}>
            <a
              href={`${API_URL}/${link.shortCode}`}
              rel="noopener noreferrer nofollow"
              className="block rounded-[var(--radius)] border border-border bg-card px-4 py-3.5 text-center text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-auto pt-8 text-xs text-muted-foreground">
        <Logo className="text-sm" />
      </footer>
    </main>
  );
}
