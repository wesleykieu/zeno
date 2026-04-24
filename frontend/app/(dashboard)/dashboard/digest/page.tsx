"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { WatcherMatch } from "@/types";
import { Bell, RefreshCw } from "lucide-react";

export default function DigestPage() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<WatcherMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ matches_found: number; new: number } | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;
    api.watchers.matches(session.accessToken).then(setMatches).finally(() => setLoading(false));
  }, [session?.accessToken]);

  async function handleCheck() {
    if (!session?.accessToken) return;
    setChecking(true);
    setCheckResult(null);
    try {
      const result = await api.gmail.checkWatchers(session.accessToken);
      setCheckResult(result);
      const updated = await api.watchers.matches(session.accessToken);
      setMatches(updated);
    } finally {
      setChecking(false);
    }
  }

  const grouped = matches.reduce<Record<string, WatcherMatch[]>>((acc, m) => {
    const key = m.watchers?.name ?? m.watcher_id;
    (acc[key] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digest</h1>
          <p className="text-gray-500 mt-1 text-sm">Emails matched by your watchers</p>
        </div>
        <button
          onClick={handleCheck}
          disabled={checking}
          className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-60 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Checking…" : "Check Now"}
        </button>
      </div>

      {checkResult && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
          Check complete — {checkResult.matches_found} matches found, {checkResult.new} new.
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No matches yet. Set up watchers and run a check.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([watcherName, items]) => (
            <div key={watcherName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-900 text-sm">{watcherName}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {items.length} match{items.length !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((m) => (
                  <div key={m.id} className="px-5 py-3">
                    <p className="font-medium text-gray-800 text-sm">{m.email_subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.sender} · {formatDate(m.received_at)}
                    </p>
                    {m.snippet && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{m.snippet}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
