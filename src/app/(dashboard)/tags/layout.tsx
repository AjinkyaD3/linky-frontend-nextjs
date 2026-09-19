import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Organise your short links with tags.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
