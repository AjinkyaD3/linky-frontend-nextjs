import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links",
  description: "Manage your short links.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
