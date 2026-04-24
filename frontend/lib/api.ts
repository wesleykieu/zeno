import type { Subscription, Watcher, WatcherMatch } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function req<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  gmail: {
    scan: (token: string, maxResults = 500) =>
      req<{ scanned: number; new: number }>("/api/gmail/scan", token, {
        method: "POST",
        body: JSON.stringify({ max_results: maxResults }),
      }),
    checkWatchers: (token: string, sinceDays = 1) =>
      req<{ matches_found: number; new: number }>("/api/gmail/check-watchers", token, {
        method: "POST",
        body: JSON.stringify({ since_days: sinceDays }),
      }),
  },

  subscriptions: {
    list: (token: string, status?: string) =>
      req<Subscription[]>(`/api/subscriptions${status ? `?status=${status}` : ""}`, token),
    unsubscribe: (token: string, subscriptionId: string) =>
      req<{ success: boolean; status: string }>("/api/subscriptions/unsubscribe", token, {
        method: "POST",
        body: JSON.stringify({ subscription_id: subscriptionId }),
      }),
    delete: (token: string, subscriptionId: string) =>
      req<{ deleted: boolean }>(`/api/subscriptions/${subscriptionId}`, token, {
        method: "DELETE",
      }),
  },

  watchers: {
    list: (token: string) => req<Watcher[]>("/api/watchers", token),
    create: (token: string, watcher: Omit<Watcher, "id" | "created_at" | "user_id">) =>
      req<Watcher>("/api/watchers", token, {
        method: "POST",
        body: JSON.stringify(watcher),
      }),
    update: (token: string, watcherId: string, updates: Partial<Watcher>) =>
      req<Watcher>(`/api/watchers/${watcherId}`, token, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    delete: (token: string, watcherId: string) =>
      req<{ deleted: boolean }>(`/api/watchers/${watcherId}`, token, { method: "DELETE" }),
    matches: (token: string) => req<WatcherMatch[]>("/api/watchers/matches", token),
  },
};
