import { LinkDetail } from "./link-detail";

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <LinkDetail shortCode={shortCode} />;
}
