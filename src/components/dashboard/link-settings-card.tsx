"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlApi } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import { completeRules, instantToLocalInput, localInputToInstant } from "@/lib/link-tools";
import type { RoutingRule, UrlResponse } from "@/lib/types";
import { RoutingRulesEditor } from "./routing-rules-editor";

/**
 * Edit where a link points, when it expires, and who gets sent where. The short code, QR code and
 * analytics all stay the same, which is the point of an editable destination.
 */
export function LinkSettingsCard({ url }: { url: UrlResponse }) {
  const queryClient = useQueryClient();
  const [destination, setDestination] = useState(url.originalUrl);
  const [expires, setExpires] = useState(instantToLocalInput(url.expiresAt));
  const [rules, setRules] = useState<RoutingRule[]>(url.routingRules ?? []);

  const mutation = useMutation({
    mutationFn: () => {
      const expiresAt = localInputToInstant(expires);
      return urlApi.update(url.shortCode, {
        originalUrl: destination.trim(),
        // an emptied field removes an existing expiry; a filled one sets/replaces it
        expiresAt,
        clearExpiry: !expiresAt && !!url.expiresAt ? true : undefined,
        routingRules: completeRules(rules),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("Link updated. The change is live now.");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not update link");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Destination and rules</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination">Destination URL</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Change it any time. The short link, its QR code and its analytics stay the same.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expires">Expires</Label>
            <Input
              id="expires"
              type="datetime-local"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave empty for a link that never expires.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Smart routing</Label>
            <RoutingRulesEditor value={rules} onChange={setRules} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={mutation.isPending}>
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
