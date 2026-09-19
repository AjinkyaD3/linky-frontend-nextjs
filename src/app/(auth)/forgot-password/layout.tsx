import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your Linky account.",
  alternates: { canonical: "/forgot-password" },
  openGraph: { title: "Reset your password", description: "Request a password reset link for your Linky account.", url: "/forgot-password" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
