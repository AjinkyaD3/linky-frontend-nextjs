import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Linky account to manage your short links and analytics.",
  alternates: { canonical: "/login" },
  openGraph: { title: "Sign in", description: "Sign in to your Linky account to manage your short links and analytics.", url: "/login" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
