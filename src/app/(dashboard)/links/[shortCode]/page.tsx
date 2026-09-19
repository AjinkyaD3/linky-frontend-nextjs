import type { Metadata } from "next";
import { LinkDetail } from "./link-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}): Promise<Metadata> {
  const { shortCode } = await params;
  return {
    title: `/${shortCode}`,
    description: "Analytics and settings for this short link.",
    robots: { index: false, follow: false },
  };
}

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <LinkDetail shortCode={shortCode} />;
}
