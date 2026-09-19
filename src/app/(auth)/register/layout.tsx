import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a free Linky account for password-protected short links, QR codes and click analytics.",
  alternates: { canonical: "/register" },
  openGraph: { title: "Create an account", description: "Create a free Linky account for password-protected short links, QR codes and click analytics.", url: "/register" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
