"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, ExternalLink, Loader2, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ClicksChart } from "@/components/dashboard/clicks-chart";
import { TopList } from "@/components/dashboard/top-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeChip } from "@/components/ui/code-chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { analyticsApi, urlApi } from "@/lib/api";
import { ApiError, shortLinkUrl } from "@/lib/api-client";
import { cn, formatNumber } from "@/lib/utils";
import { useState } from "react";

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LinkDetail({ shortCode }: { shortCode: string }) {
  const [days, setDays] = useState("7");
  const queryClient = useQueryClient();

  const { data: urls, isLoading: loadingUrl } = useQuery({
    queryKey: ["urls", "mine"],
    queryFn: () => urlApi.getMine(),
  });
  const url = urls?.find((u) => u.shortCode === shortCode);

  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["analytics", shortCode, days],
    queryFn: () => analyticsApi.get(shortCode, Number(days)),
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: url ? { title: url.title ?? "", description: url.description ?? "" } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => urlApi.update(shortCode, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("Link updated");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not update link");
    },
  });

  if (loadingUrl) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="font-medium">Link not found</p>
        <Link href="/links" className="text-sm text-accent hover:underline">
          Back to links
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/links"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to links
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <CodeChip className="text-sm">{shortCode}</CodeChip>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(shortLinkUrl(shortCode));
              toast.success("Copied to clipboard");
            }}
          >
            <Copy /> Copy
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <a href={shortLinkUrl(shortCode)} target="_blank" rel="noreferrer">
              <ExternalLink /> Open
            </a>
          </Button>
        </div>
        <p className="mt-2 max-w-2xl truncate text-sm text-muted-foreground">
          {url.originalUrl}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Give this link a name" {...register("title")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} {...register("description")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => reset()}>
                  Reset
                </Button>
                <Button type="submit" loading={updateMutation.isPending}>
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent-hover dark:text-accent">
              <MousePointerClick className="size-5" />
            </div>
            <p className="text-3xl font-bold">{formatNumber(analytics?.totalClicks ?? 0)}</p>
            <p className="text-sm text-muted-foreground">total clicks</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Analytics</h2>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent
            className={cn("p-5", loadingAnalytics && "flex justify-center py-20")}
          >
            {loadingAnalytics || !analytics ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <ClicksChart data={analytics.clicksOverTime} />
            )}
          </CardContent>
        </Card>

        {analytics && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TopList title="Top browsers" items={analytics.topBrowsers} />
            <TopList title="Top devices" items={analytics.topDevices} />
            <TopList title="Top countries" items={analytics.topCountries} />
            <TopList title="Top referrers" items={analytics.topReferrers} />
          </div>
        )}
      </div>
    </div>
  );
}
