"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, ListPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { urlApi } from "@/lib/api";
import { ApiError, shortLinkUrl } from "@/lib/api-client";
import { parseBulkLines } from "@/lib/link-tools";
import type { BulkResult } from "@/lib/types";

const MAX_ROWS = 100;

/** Create many short links at once: paste one URL per line (optionally `alias, url`). */
export function BulkCreateDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [results, setResults] = useState<BulkResult[] | null>(null);
  const queryClient = useQueryClient();

  const rows = parseBulkLines(text);

  const mutation = useMutation({
    mutationFn: () => urlApi.bulkCreate(rows),
    onSuccess: (data) => {
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      const ok = data.filter((r) => r.success).length;
      toast.success(`${ok} of ${data.length} links created`);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Bulk create failed");
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setText("");
      setResults(null);
    }
  }

  const created = results?.filter((r) => r.success && r.link) ?? [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <ListPlus />
          Bulk create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create links in bulk</DialogTitle>
        </DialogHeader>

        {results ? (
          <>
            <ul className="flex max-h-72 flex-col gap-1.5 overflow-y-auto text-sm" aria-label="Results">
              {results.map((r) => (
                <li key={r.index} className="flex items-start gap-2">
                  {r.success ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <span className="min-w-0 break-all">
                    {r.success && r.link ? (
                      <>
                        <span className="font-mono">{shortLinkUrl(r.link.shortCode)}</span>
                        <span className="text-muted-foreground"> &rarr; {r.link.originalUrl}</span>
                      </>
                    ) : (
                      <span className="text-destructive">
                        Row {r.index + 1}: {r.error ?? "failed"}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button
                variant="secondary"
                disabled={created.length === 0}
                onClick={() => {
                  navigator.clipboard.writeText(
                    created.map((r) => shortLinkUrl(r.link!.shortCode)).join("\n")
                  );
                  toast.success("Copied all short links");
                }}
              >
                <Copy /> Copy all
              </Button>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (rows.length > 0) mutation.mutate();
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bulk-urls">One URL per line</Label>
              <Textarea
                id="bulk-urls"
                rows={8}
                placeholder={"https://example.com/one\nhttps://example.com/two\nmy-alias, https://example.com/three"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use <code>alias, url</code> to set a custom alias. Up to {MAX_ROWS} per batch.
              </p>
            </div>
            <DialogFooter>
              <span className="mr-auto self-center text-xs text-muted-foreground">
                {rows.length} {rows.length === 1 ? "link" : "links"}
              </span>
              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={rows.length === 0 || rows.length > MAX_ROWS}
              >
                Create {rows.length || ""} links
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
