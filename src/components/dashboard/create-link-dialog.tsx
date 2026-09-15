"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Copy, Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CodeChip } from "@/components/ui/code-chip";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { urlApi } from "@/lib/api";
import { ApiError, shortLinkUrl } from "@/lib/api-client";
import type { UrlResponse } from "@/lib/types";

const schema = z.object({
  originalUrl: z.string().min(1, "A URL is required").url("Enter a valid URL"),
  customAlias: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  password: z.string().optional(),
  isOneTime: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function CreateLinkDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [created, setCreated] = useState<UrlResponse | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { visibility: "PUBLIC", isOneTime: false },
  });

  const visibility = useWatch({ control, name: "visibility" });
  const isOneTime = useWatch({ control, name: "isOneTime" });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      urlApi.create({
        originalUrl: values.originalUrl,
        customAlias: values.customAlias || undefined,
        visibility: values.visibility,
        password: values.password || undefined,
        isOneTime: values.isOneTime,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      setCreated(data);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not create link");
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      setCreated(null);
      setAdvanced(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus />
            New link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Link created</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border bg-muted p-3">
              <CodeChip className="border-0 bg-transparent p-0">
                {shortLinkUrl(created.shortCode)}
              </CodeChip>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(shortLinkUrl(created.shortCode));
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy />
                Copy
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create a short link</DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="originalUrl">Destination URL</Label>
                <Input
                  id="originalUrl"
                  placeholder="https://example.com/a-very-long-url"
                  invalid={!!errors.originalUrl}
                  {...register("originalUrl")}
                />
                {errors.originalUrl && (
                  <p className="text-xs text-destructive">{errors.originalUrl.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className="flex items-center gap-1 self-start text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className={advanced ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} />
                Advanced options
              </button>

              {advanced && (
                <div className="flex flex-col gap-4 rounded-[var(--radius-sm)] border border-border p-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="customAlias">Custom alias</Label>
                    <Input id="customAlias" placeholder="my-link" {...register("customAlias")} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Visibility</Label>
                    <Select
                      value={visibility}
                      onValueChange={(v) => setValue("visibility", v as FormValues["visibility"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="PRIVATE">Private (only you)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Leave blank for no password"
                      {...register("password")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isOneTime">One-time use</Label>
                      <p className="text-xs text-muted-foreground">
                        Link deactivates after the first click
                      </p>
                    </div>
                    <Switch
                      id="isOneTime"
                      checked={isOneTime}
                      onCheckedChange={(v) => setValue("isOneTime", v)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="submit" loading={mutation.isPending}>
                  Create link
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
