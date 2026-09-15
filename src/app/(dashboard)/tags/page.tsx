"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { tagApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});
type FormValues = z.infer<typeof schema>;

export default function TagsPage() {
  const queryClient = useQueryClient();
  const { data: tags, isLoading } = useQuery({ queryKey: ["tags"], queryFn: tagApi.list });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => tagApi.create(values.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      reset();
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError && err.status === 409
          ? "You already have a tag with that name"
          : "Could not create tag"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tagApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted");
    },
  });

  return (
    <div>
      <PageHeader title="Tags" description="Organize your links with tags." />

      <Card className="mb-6">
        <CardContent className="p-5">
          <form
            className="flex items-start gap-3"
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          >
            <div className="flex-1">
              <Input placeholder="New tag name" invalid={!!errors.name} {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <Button type="submit" loading={createMutation.isPending}>
              <Plus /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !tags?.length ? (
            <EmptyState icon={TagIcon} title="No tags yet" description="Create a tag above to start organizing your links." />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {tags.map((tag) => (
                <li key={tag.id} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <TagIcon className="size-4 text-muted-foreground" />
                    {tag.name}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete tag"
                    onClick={() => deleteMutation.mutate(tag.id)}
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
