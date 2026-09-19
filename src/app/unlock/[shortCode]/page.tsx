import type { Metadata } from "next";
import { UnlockForm } from "./unlock-form";

export const metadata: Metadata = {
  title: "Unlock this link",
  description: "This short link is password protected.",
  // A password gate for someone else's link has nothing to index and should
  // never leak a short code into search results.
  robots: { index: false, follow: false },
};

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <UnlockForm shortCode={shortCode} />;
}
