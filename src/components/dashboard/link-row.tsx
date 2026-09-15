"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  ArchiveRestore,
  BarChart3,
  Copy,
  Ellipsis,
  ExternalLink,
  QrCode,
  Star,
  Trash2,
  Copy as CopyIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CodeChip } from "@/components/ui/code-chip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { urlApi } from "@/lib/api";
import { ApiError, qrCodeUrl, shortLinkUrl } from "@/lib/api-client";
import type { UrlResponse } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";

export function LinkRow({ url }: { url: UrlResponse }) {
  const queryClient = useQueryClient();
  const [qrOpen, setQrOpen] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["urls"] });

  const favoriteMutation = useMutation({
    mutationFn: () => urlApi.toggleFavorite(url.shortCode),
    onSuccess: invalidate,
  });
  const archiveMutation = useMutation({
    mutationFn: () => urlApi.toggleArchive(url.shortCode),
    onSuccess: invalidate,
  });
  const duplicateMutation = useMutation({
    mutationFn: () => urlApi.duplicate(url.shortCode),
    onSuccess: () => {
      invalidate();
      toast.success("Link duplicated");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => urlApi.remove(url.id),
    onSuccess: () => {
      invalidate();
      toast.success("Link deleted");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not delete link");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/links/${url.shortCode}`} className="shrink-0">
              <CodeChip className="hover:border-accent">{url.shortCode}</CodeChip>
            </Link>
            {url.title && (
              <span className="truncate text-sm font-medium">{url.title}</span>
            )}
            <button
              onClick={() => favoriteMutation.mutate()}
              aria-label="Toggle favorite"
              className="text-muted-foreground hover:text-accent"
            >
              <Star
                className={cn("size-4", url.isFavorite && "fill-accent text-accent")}
              />
            </button>
          </div>
          <p className="max-w-xl truncate text-sm text-muted-foreground">
            {url.originalUrl}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {url.visibility === "PRIVATE" && <Badge variant="accent">Private</Badge>}
            {url.isArchived && <Badge>Archived</Badge>}
            {url.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <div className="text-right">
            <p className="text-sm font-semibold">{formatNumber(url.clickCount)}</p>
            <p className="text-xs text-muted-foreground">clicks</p>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {formatDate(url.createdAt)}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] hover:bg-muted">
              <Ellipsis className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={shortLinkUrl(url.shortCode)} target="_blank" rel="noreferrer">
                  <ExternalLink /> Open link
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigator.clipboard.writeText(shortLinkUrl(url.shortCode));
                  toast.success("Copied to clipboard");
                }}
              >
                <CopyIcon /> Copy short link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/links/${url.shortCode}`}>
                  <BarChart3 /> View analytics
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setQrOpen(true)}>
                <QrCode /> QR code
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => duplicateMutation.mutate()}>
                <Copy /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => archiveMutation.mutate()}>
                {url.isArchived ? <ArchiveRestore /> : <Archive />}
                {url.isArchived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => deleteMutation.mutate()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>QR code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl(url.shortCode, "png")}
              alt={`QR code for ${url.shortCode}`}
              className="size-48 rounded-[var(--radius-sm)] border border-border p-2"
            />
            <CodeChip>{shortLinkUrl(url.shortCode)}</CodeChip>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
