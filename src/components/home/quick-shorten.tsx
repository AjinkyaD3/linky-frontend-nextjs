"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CodeChip } from "@/components/ui/code-chip";
import { Input } from "@/components/ui/input";
import { urlApi } from "@/lib/api";
import { ApiError, shortLinkUrl } from "@/lib/api-client";

const schema = z.object({
  originalUrl: z.string().min(1, "Paste a link to shorten it").url("Enter a valid URL"),
});
type FormValues = z.infer<typeof schema>;

export function QuickShorten() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => urlApi.create({ originalUrl: values.originalUrl }),
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not shorten link");
    },
  });

  return (
    <div className="w-full max-w-lg">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <Input
          placeholder="Paste a long URL..."
          className="h-12 flex-1"
          invalid={!!errors.originalUrl}
          {...register("originalUrl")}
        />
        <Button type="submit" size="lg" loading={mutation.isPending} className="h-12">
          Shorten <ArrowRight className="size-4" />
        </Button>
      </form>
      {errors.originalUrl && (
        <p className="mt-2 text-sm text-destructive">{errors.originalUrl.message}</p>
      )}

      {mutation.data && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3">
          <CodeChip className="border-0 bg-transparent p-0">
            {shortLinkUrl(mutation.data.shortCode)}
          </CodeChip>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(shortLinkUrl(mutation.data!.shortCode));
              toast.success("Copied to clipboard");
              reset();
            }}
          >
            <Copy /> Copy
          </Button>
        </div>
      )}
    </div>
  );
}
