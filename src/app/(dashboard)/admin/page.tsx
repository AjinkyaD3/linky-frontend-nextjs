"use client";

import { useQuery } from "@tanstack/react-query";
import { Link2, Loader2, MousePointerClick, Users as UsersIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-auth";
import { adminApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-accent/15 text-accent-hover dark:text-accent">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{formatNumber(value)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser();
  const enabled = currentUser?.role === "ADMIN";

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.stats,
    enabled,
  });
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.users,
    enabled,
  });

  if (loadingUser) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="font-medium">You don&apos;t have access to this page.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Admin" description="System-wide stats and users." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={UsersIcon} label="Total users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={Link2} label="Total links" value={stats?.totalUrls ?? 0} />
        <StatCard icon={MousePointerClick} label="Total clicks" value={stats?.totalClicks ?? 0} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-semibold">Users</h2>
        <Card>
          <CardContent className="p-5">
            {loadingStats || loadingUsers ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users?.map((u) => (
                      <tr key={u.id}>
                        <td className="py-2.5">{u.name}</td>
                        <td className="py-2.5 text-muted-foreground">{u.email}</td>
                        <td className="py-2.5">
                          <Badge variant={u.role === "ADMIN" ? "accent" : "neutral"}>
                            {u.role}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
