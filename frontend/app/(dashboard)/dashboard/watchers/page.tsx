"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Watcher } from "@/types";
import { Plus, Trash2, Bell, BellOff } from "lucide-react";

export default function WatchersPage() {
  const { data: session } = useSession();
  const [watchers, setWatchers] = useState<Watcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", keywords: "", sender_pattern: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;
    api.watchers.list(session.accessToken).then(setWatchers).finally(() => setLoading(false));
  }, [session?.accessToken]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.accessToken || !form.name || !form.keywords) return;
    setSaving(true);
    try {
      const watcher = await api.watchers.create(session.accessToken, {
        name: form.name,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        sender_pattern: form.sender_pattern || null,
        is_active: true,
      });
      setWatchers((prev) => [watcher, ...prev]);
      setForm({ name: "", keywords: "", sender_pattern: "" });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleWatcher(watcher: Watcher) {
    if (!session?.accessToken) return;
    const updated = await api.watchers.update(session.accessToken, watcher.id, {
      is_active: !watcher.is_active,
    });
    setWatchers((prev) => prev.map((w) => (w.id === watcher.id ? updated : w)));
  }

  async function handleDelete(id: string) {
    if (!session?.accessToken) return;
    await api.watchers.delete(session.accessToken, id);
    setWatchers((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Watchers</h1>
          <p className="text-gray-500 mt-1 text-sm">Get alerted when emails matching your criteria arrive</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Watcher
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Create watcher</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Interview invites"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords <span className="text-gray-400 font-normal">(comma-separated)</span>
              </label>
              <input
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                placeholder="e.g. interview, assessment, offer, next steps"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sender filter <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                value={form.sender_pattern}
                onChange={(e) => setForm((f) => ({ ...f, sender_pattern: e.target.value }))}
                placeholder="e.g. @greenhouse.io or recruiting@company.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : watchers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No watchers yet. Create one to start monitoring your inbox.
        </div>
      ) : (
        <div className="space-y-3">
          {watchers.map((w) => (
            <div key={w.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${w.is_active ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-400"}`}
              >
                {w.is_active ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{w.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {w.keywords.join(", ")}
                  {w.sender_pattern && ` · from: ${w.sender_pattern}`}
                </p>
              </div>
              <button
                onClick={() => toggleWatcher(w)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  w.is_active
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {w.is_active ? "Active" : "Paused"}
              </button>
              <button onClick={() => handleDelete(w.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
