"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link2, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { BulkCreateDialog } from "@/components/dashboard/bulk-create-dialog";
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog";
import { LinkRow } from "@/components/dashboard/link-row";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { urlApi } from "@/lib/api";

type Filter = "all" | "favorites" | "archived";

const PAGE_SIZE = 20;

export default function LinksPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("newest");

  const [page, setPage] = useState(0);

  const { data: urls, isLoading } = useQuery({
    queryKey: ["urls", filter, search, sort, page],
    queryFn: () => {
      const paging = { page, size: PAGE_SIZE };
      if (filter === "favorites") return urlApi.getFavorites(paging);
      if (filter === "archived") return urlApi.getArchived(paging);
      return urlApi.getMine({ search: search || undefined, sort, ...paging });
    },
    placeholderData: keepPreviousData,
  });
  const hasNext = (urls?.length ?? 0) === PAGE_SIZE;

  return (
    <div>
      <PageHeader
        title="Links"
        description="All the short links you've created."
        action={
          <div className="flex items-center gap-2">
            <BulkCreateDialog />
            <CreateLinkDialog />
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => {
            setFilter(v as Filter);
            setPage(0);
          }}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-8 sm:w-56"
            />
          </div>
          {filter === "all" && (
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="clicks">Most clicks</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !urls?.length ? (
            <EmptyState
              icon={Link2}
              title="No links found"
              description={
                filter === "all"
                  ? "Create your first short link to get started."
                  : `You don't have any ${filter} links yet.`
              }
              action={
                filter === "all" ? (
                  <CreateLinkDialog trigger={<Button size="sm">Create a link</Button>} />
                ) : undefined
              }
            />
          ) : (
            urls.map((url) => <LinkRow key={url.id} url={url} />)
          )}
        </CardContent>
      </Card>

      {(page > 0 || hasNext) && (
        <div className="mt-4 flex items-center justify-between">
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
