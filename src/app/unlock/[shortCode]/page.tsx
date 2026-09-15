import { UnlockForm } from "./unlock-form";

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  return <UnlockForm shortCode={shortCode} />;
}
