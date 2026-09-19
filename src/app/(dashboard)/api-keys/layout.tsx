import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API keys",
  description: "Manage API keys for programmatic access.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
