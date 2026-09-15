"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Copy, KeyRound, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeChip } from "@/components/ui/code-chip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiKeyApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ApiKeyDto } from "@/lib/types";

const schema = z.object({ name: z.string().min(1, "Name is required") });
type FormValues = z.infer<typeof schema>;

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState<ApiKeyDto | null>(null);
  const { data: keys, isLoading } = useQuery({ queryKey: ["api-keys"], queryFn: apiKeyApi.list });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => apiKeyApi.create(values.name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setRevealed(data);
      reset();
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => apiKeyApi.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key revoked");
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      setRevealed(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="API Keys"
        description="Use API keys to authenticate requests without a login session."
        action={
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> New key
              </Button>
            </DialogTrigger>
            <DialogContent>
              {revealed ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Key created</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertTriangle className="size-4 shrink-0" />
                      Copy this now — you won&apos;t be able to see it again.
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border bg-muted p-3">
                      <CodeChip className="border-0 bg-transparent p-0 break-all">
                        {revealed.keyValue}
                      </CodeChip>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(revealed.keyValue);
                          toast.success("Copied to clipboard");
                        }}
                      >
                        <Copy /> Copy
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => handleOpenChange(false)}>Done</Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Create API key</DialogTitle>
                  </DialogHeader>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit((values) => createMutation.mutate(values))}
                  >
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name">Key name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. CI pipeline"
                        invalid={!!errors.name}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" loading={createMutation.isPending}>
                        Create key
                      </Button>
                    </DialogFooter>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !keys?.length ? (
            <EmptyState
              icon={KeyRound}
              title="No API keys yet"
              description="Create one to authenticate requests with the X-API-KEY header."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {keys.map((key) => (
                <li key={key.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-medium">{key.name}</span>
                    <div className="flex items-center gap-2">
                      <CodeChip className="text-xs">{key.keyValue}</CodeChip>
                      <span className="text-xs text-muted-foreground">
                        Created {formatDate(key.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Revoke key"
                    onClick={() => revokeMutation.mutate(key.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
