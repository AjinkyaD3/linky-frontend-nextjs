"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pageApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import type { OwnerPage } from "@/lib/types";

const MAX_LINKS = 20;

interface Row {
  label: string;
  url: string;
}

/** Create or edit a link-in-bio page. Pass `page` to edit it. */
export function PageEditorDialog({ page, trigger }: { page?: OwnerPage; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [title, setTitle] = useState(page?.title ?? "");
  const [bio, setBio] = useState(page?.bio ?? "");
  const [rows, setRows] = useState<Row[]>(
    page?.links.map((l) => ({ label: l.label, url: l.url })) ?? [{ label: "", url: "" }]
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        slug: slug.trim(),
        title: title.trim(),
        bio: bio.trim() || undefined,
        links: rows
          .map((r) => ({ label: r.label.trim(), url: r.url.trim() }))
          .filter((r) => r.label || r.url),
      };
      return page ? pageApi.update(page.id, payload) : pageApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success(page ? "Page updated" : "Page created");
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not save page");
    },
  });

  const update = (i: number, patch: Partial<Row>) =>
    setRows((current) => current.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const move = (i: number, delta: number) =>
    setRows((current) => {
      const j = i + delta;
      if (j < 0 || j >= current.length) return current;
      const next = [...current];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{page ? "Edit page" : "Create a link-in-bio page"}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="page-slug">Page address</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/p/</span>
              <Input
                id="page-slug"
                placeholder="your-name"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
              />
            </div>
            <p className="text-xs text-muted-foreground">3-40 characters: lowercase letters, digits, dashes.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="page-title">Title</Label>
            <Input id="page-title" placeholder="Ajinkya Dhotre" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="page-bio">Bio (optional)</Label>
            <Textarea id="page-bio" rows={2} maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Links</Label>
            {rows.map((row, i) => (
              <div key={i} className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-border p-2">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Input
                    placeholder="Button label (GitHub)"
                    aria-label={`Link ${i + 1} label`}
                    value={row.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                  <Input
                    placeholder="https://…"
                    aria-label={`Link ${i + 1} URL`}
                    value={row.url}
                    onChange={(e) => update(i, { url: e.target.value })}
                  />
                </div>
                <div className="flex flex-col">
                  <button type="button" aria-label="Move up" className="p-1 text-muted-foreground hover:text-foreground" onClick={() => move(i, -1)}>
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" aria-label="Move down" className="p-1 text-muted-foreground hover:text-foreground" onClick={() => move(i, 1)}>
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove link"
                    className="p-1 text-muted-foreground hover:text-destructive"
                    onClick={() => setRows((c) => c.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="self-start"
              disabled={rows.length >= MAX_LINKS}
              onClick={() => setRows((c) => [...c, { label: "", url: "" }])}
            >
              <Plus /> Add link
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit" loading={mutation.isPending}>
              {page ? "Save page" : "Create page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
