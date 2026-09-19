import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Linky profile and account settings.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
