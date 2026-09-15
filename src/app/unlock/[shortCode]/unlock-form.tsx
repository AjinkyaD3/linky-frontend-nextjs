"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CodeChip } from "@/components/ui/code-chip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function UnlockForm({ shortCode }: { shortCode: string }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => urlApi.unlock(shortCode, values.password),
    onSuccess: (data) => {
      window.location.href = data.originalUrl;
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 403) {
        setError("password", { message: "That password isn't right." });
        return;
      }
      setError("password", {
        message: err instanceof ApiError ? err.message : "Something went wrong",
      });
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo className="text-xl" />
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-7 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted">
            <Lock className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">This link is protected</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the password for <CodeChip>{shortCode}</CodeChip>
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoFocus
              invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" loading={mutation.isPending}>
            Unlock link
          </Button>
        </form>
      </div>
    </div>
  );
}
