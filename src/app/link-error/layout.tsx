import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link unavailable",
  description: "This short link could not be opened.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
