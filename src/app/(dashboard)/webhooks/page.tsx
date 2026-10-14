"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Copy, Loader2, Plus, Send, Trash2, Webhook as WebhookIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { webhookApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import type { Delivery, Webhook } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const EVENT_LABELS: Record<string, string> = {
  "link.created": "A link is created",
  "link.milestone": "A link reaches 10, 100, 1,000… clicks",
};

function CreateWebhookDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["link.created", "link.milestone"]);
  const [secret, setSecret] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => webhookApi.create({ url: url.trim(), events }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setSecret(created.secret ?? null);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not create webhook"),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setUrl("");
      setSecret(null);
      setEvents(["link.created", "link.milestone"]);
    }
  }

  const toggleEvent = (name: string) =>
    setEvents((current) => (current.includes(name) ? current.filter((e) => e !== name) : [...current, name]));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        {secret ? (
          <>
            <DialogHeader>
              <DialogTitle>Webhook created</DialogTitle>
              <DialogDescription>
                Copy your signing secret now. It is shown only once. Use it to verify the
                X-Linky-Signature header on every delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border bg-muted p-3">
              <code className="min-w-0 break-all text-xs" data-testid="webhook-secret">{secret}</code>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(secret);
                  toast.success("Secret copied");
                }}
              >
                <Copy /> Copy
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add a webhook</DialogTitle>
              <DialogDescription>
                Linky sends a signed HTTPS POST to your endpoint when something happens.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/linky-webhook"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Must be a public HTTPS address.</p>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium">Send me events when</legend>
                {Object.entries(EVENT_LABELS).map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={events.includes(name)}
                      onChange={() => toggleEvent(name)}
                      className="size-4 accent-[var(--accent)]"
                    />
                    <span>{label}</span>
                    <code className="text-xs text-muted-foreground">{name}</code>
                  </label>
                ))}
              </fieldset>
              <DialogFooter>
                <Button type="submit" loading={mutation.isPending} disabled={!url.trim() || events.length === 0}>
                  Create webhook
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Deliveries({ id }: { id: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["webhooks", id, "deliveries"],
    queryFn: () => webhookApi.deliveries(id),
    refetchInterval: 5000,
  });

  if (isLoading) return <Loader2 className="my-3 size-4 animate-spin text-muted-foreground" />;
  if (!data?.length) return <p className="py-3 text-xs text-muted-foreground">No deliveries yet.</p>;

  return (
    <ul className="mt-3 flex flex-col gap-1.5" aria-label="Recent deliveries">
      {data.map((d: Delivery) => (
        <li key={d.id} className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={d.status === "DELIVERED" ? "success" : d.status === "FAILED" ? "destructive" : "neutral"}>
            {d.status.toLowerCase()}
          </Badge>
          <code>{d.event}</code>
          <span className="text-muted-foreground">
            {d.attempts} {d.attempts === 1 ? "attempt" : "attempts"}
            {d.lastStatusCode ? ` · HTTP ${d.lastStatusCode}` : ""}
            {d.lastError && d.status !== "DELIVERED" ? ` · ${d.lastError}` : ""}
          </span>
          <span className="ml-auto text-muted-foreground">{formatDate(d.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}

function WebhookRow({ webhook }: { webhook: Webhook }) {
  const queryClient = useQueryClient();
  const [showDeliveries, setShowDeliveries] = useState(false);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["webhooks"] });

  const toggle = useMutation({
    mutationFn: (active: boolean) => webhookApi.update(webhook.id, { active }),
    onSuccess: invalidate,
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not update webhook"),
  });
  const test = useMutation({
    mutationFn: () => webhookApi.test(webhook.id),
    onSuccess: () => {
      toast.success("Test event queued");
      setShowDeliveries(true);
      queryClient.invalidateQueries({ queryKey: ["webhooks", webhook.id, "deliveries"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not send test"),
  });
  const remove = useMutation({
    mutationFn: () => webhookApi.remove(webhook.id),
    onSuccess: () => {
      invalidate();
      toast.success("Webhook deleted");
    },
  });

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm">{webhook.url}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {webhook.events.map((e) => (
              <Badge key={e}>{e}</Badge>
            ))}
            {!webhook.active && <Badge variant="destructive">Disabled</Badge>}
            {webhook.active && webhook.consecutiveFailures > 0 && (
              <Badge variant="destructive">{webhook.consecutiveFailures} recent failures</Badge>
            )}
          </div>
          {webhook.disabledReason && (
            <p className="mt-1.5 text-xs text-destructive">{webhook.disabledReason}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Switch
            checked={webhook.active}
            onCheckedChange={(v) => toggle.mutate(v)}
            aria-label={webhook.active ? "Disable webhook" : "Enable webhook"}
          />
          <Button size="sm" variant="secondary" disabled={!webhook.active} loading={test.isPending} onClick={() => test.mutate()}>
            <Send /> Send test
          </Button>
          <Button size="icon" variant="ghost" aria-label="Show deliveries" onClick={() => setShowDeliveries((v) => !v)}>
            <ChevronDown className={showDeliveries ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Delete webhook" onClick={() => remove.mutate()}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
      {showDeliveries && <Deliveries id={webhook.id} />}
    </li>
  );
}

export default function WebhooksPage() {
  const { data: webhooks, isLoading } = useQuery({ queryKey: ["webhooks"], queryFn: webhookApi.list });

  return (
    <div>
      <PageHeader
        title="Webhooks"
        description="Get a signed HTTPS request at your own endpoint when links are created or hit a click milestone."
        action={<CreateWebhookDialog />}
      />

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !webhooks?.length ? (
            <EmptyState
              icon={WebhookIcon}
              title="No webhooks yet"
              description="Add an endpoint to start receiving events. Failed deliveries are retried with backoff."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {webhooks.map((w) => (
                <WebhookRow key={w.id} webhook={w} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-2 p-5 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Check className="size-4 text-success" /> Verifying a delivery
          </p>
          <p className="text-muted-foreground">
            Each request has <code>X-Linky-Timestamp</code> and <code>X-Linky-Signature: sha256=&lt;hex&gt;</code>,
            where the signature is HMAC-SHA256 of <code>timestamp + &quot;.&quot; + raw body</code> using your secret.
            Reject requests whose timestamp is more than a few minutes old.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
