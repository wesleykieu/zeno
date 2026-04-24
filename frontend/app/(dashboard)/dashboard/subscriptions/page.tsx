"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Subscription } from "@/types";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  unsubscribed: "secondary",
  pending: "outline",
};

const STATUS_CLASS: Record<string, string> = {
  active: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
  unsubscribed: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  pending: "text-muted-foreground",
};

const FILTERS = ["all", "active", "unsubscribed"] as const;

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session?.accessToken) return;
    api.subscriptions
      .list(session.accessToken)
      .then(setSubs)
      .catch(() => toast.error("Failed to load subscriptions"))
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  async function handleUnsubscribe(sub: Subscription) {
    if (!session?.accessToken) return;
    setPending((p) => new Set(p).add(sub.id));
    try {
      const result = await api.subscriptions.unsubscribe(session.accessToken, sub.id);
      setSubs((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: result.status as Subscription["status"] } : s))
      );
      if (result.status === "unsubscribed") {
        toast.success(`Unsubscribed from ${sub.sender_name || sub.sender_email}`);
      } else {
        toast.info("Marked as pending — finish unsubscribing via the link");
      }
    } catch {
      toast.error(`Failed to unsubscribe from ${sub.sender_name || sub.sender_email}`);
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(sub.id);
        return next;
      });
    }
  }

  async function handleDelete(id: string) {
    if (!session?.accessToken) return;
    try {
      await api.subscriptions.delete(session.accessToken, id);
      setSubs((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Failed to delete subscription");
    }
  }

  const filtered = filter === "all" ? subs : subs.filter((s) => s.status === filter);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground mt-1 text-sm">{subs.length} senders found in your inbox</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-4 w-16 hidden sm:block" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-border rounded-lg">
          {filter === "all"
            ? "No subscriptions found. Run a scan from the dashboard."
            : `No ${filter} subscriptions.`}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Emails</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Last seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <p className="font-medium text-foreground truncate max-w-[200px]">
                      {sub.sender_name || sub.sender_email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {sub.sender_email}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                    {sub.email_count}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-xs text-muted-foreground">
                    {formatDate(sub.last_email_date)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[sub.status] ?? "outline"}
                      className={STATUS_CLASS[sub.status]}
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {sub.unsubscribe_link && sub.status === "active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsubscribe(sub)}
                          disabled={pending.has(sub.id)}
                          className="text-primary hover:text-primary text-xs font-medium"
                        >
                          {pending.has(sub.id) ? "Working…" : "Unsubscribe"}
                        </Button>
                      )}
                      {sub.unsubscribe_link && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
                          <a href={sub.unsubscribe_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sub.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
