"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageEditorDialog } from "@/components/dashboard/page-editor-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { pageApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

export default function PagesPage() {
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useQuery({ queryKey: ["pages"], queryFn: pageApi.mine });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pageApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page deleted");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not delete page");
    },
  });

  const newPageButton = (
    <Button>
      <Plus /> New page
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Link-in-bio pages: one shareable page with all your links. Clicks are tracked like any other link."
        action={<PageEditorDialog trigger={newPageButton} />}
      />

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !pages?.length ? (
            <EmptyState
              icon={FileText}
              title="No pages yet"
              description="Create a page to share all your links from one address."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {pages.map((page) => (
                <li key={page.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{page.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /p/{page.slug} &middot; {page.links.length} {page.links.length === 1 ? "link" : "links"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button asChild size="icon" variant="ghost" aria-label="Open page">
                      <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                    <PageEditorDialog
                      page={page}
                      trigger={
                        <Button size="icon" variant="ghost" aria-label="Edit page">
                          <Pencil className="size-4" />
                        </Button>
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete page"
                      onClick={() => deleteMutation.mutate(page.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
