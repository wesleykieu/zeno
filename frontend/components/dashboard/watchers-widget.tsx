"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, Package, Briefcase, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const iconMap: Record<string, React.ElementType> = {
  Package,
  Briefcase,
  FileText,
  Sparkles,
};

const initialWatchers = [
  {
    label: "Amazon Order #112-8847",
    detail: "Delivered by Thursday",
    icon: "Package",
    status: "tracking",
  },
  {
    label: "Stripe Interview Follow-up",
    detail: "Sent application 2 days ago",
    icon: "Briefcase",
    status: "waiting",
  },
  {
    label: "YC Application Decision",
    detail: "Results expected this week",
    icon: "FileText",
    status: "waiting",
  },
];

const statusStyles: Record<string, string> = {
  tracking: "bg-foreground/10 text-foreground",
  waiting: "bg-muted text-muted-foreground",
};

const suggestions = ["Potential interviews", "Online assessments", "Investor replies", "Job offers"];

export function WatchersWidget() {
  const [watchers, setWatchers] = useState(initialWatchers);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [input, setInput] = useState("");

  function addWatcher(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setWatchers((prev) => [
      ...prev,
      { label: trimmed, detail: "Watching for new emails", icon: "Sparkles", status: "waiting" },
    ]);
    setInput("");
    setPopoverOpen(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-background/80 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Watching</CardTitle>
            <div className="flex items-center gap-2">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`p-1 rounded-md transition-colors ${popoverOpen ? "bg-muted" : "hover:bg-muted"}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="left"
                  align="start"
                  className="w-72 p-4"
                >
                  <p className="text-sm font-semibold mb-1">Add a watcher</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tell the agent what to look out for in your inbox.
                  </p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => addWatcher(s)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 focus-within:ring-1 focus-within:ring-border">
                    <input
                      autoFocus
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addWatcher(input);
                        if (e.key === "Escape") setPopoverOpen(false);
                      }}
                      placeholder="e.g. OAs from top companies..."
                      className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                    />
                    <button
                      onClick={() => addWatcher(input)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="px-4 pt-3 pb-4 space-y-2.5">
          {watchers.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="mt-0.5 p-1.5 rounded-md bg-muted">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0 h-4 shrink-0 border-0 ${statusStyles[item.status]}`}>
                  {item.status}
                </Badge>
              </motion.div>
            );
          })}

        </CardContent>
      </Card>
    </motion.div>
  );
}
