"use client";

import { useQuery } from "@tanstack/react-query";
import { Link2, Loader2, MousePointerClick, Star } from "lucide-react";
import Link from "next/link";
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog";
import { LinkRow } from "@/components/dashboard/link-row";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { urlApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent/15 text-accent-hover dark:text-accent">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{formatNumber(value)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverviewPage() {
  const { data: urls, isLoading } = useQuery({
    queryKey: ["urls", "mine"],
    queryFn: () => urlApi.getMine(),
  });

  const totalClicks = urls?.reduce((sum, u) => sum + u.clickCount, 0) ?? 0;
  const favorites = urls?.filter((u) => u.isFavorite).length ?? 0;
  const recent = urls?.slice(0, 5) ?? [];

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your links at a glance."
        action={<CreateLinkDialog />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Link2} label="Total links" value={urls?.length ?? 0} />
        <StatCard icon={MousePointerClick} label="Total clicks" value={totalClicks} />
        <StatCard icon={Star} label="Favorites" value={favorites} />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent links</h2>
          {!!urls?.length && (
            <Link href="/links" className="text-sm text-accent hover:underline">
              View all
            </Link>
          )}
        </div>

        <Card>
          <CardContent className="p-5">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : recent.length === 0 ? (
              <EmptyState
                icon={Link2}
                title="No links yet"
                description="Create your first short link to see it here."
                action={<CreateLinkDialog trigger={<Button size="sm">Create a link</Button>} />}
              />
            ) : (
              recent.map((url) => <LinkRow key={url.id} url={url} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
