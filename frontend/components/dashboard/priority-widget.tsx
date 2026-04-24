"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Reply, BellOff, AlarmClock, CornerDownRight, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { EmailModal, type EmailItem } from "@/components/dashboard/email-modal";

const mockPriority = [
  {
    from: "Stripe",
    subject: "Interview invitation — Software Engineer",
    time: "Yesterday",
    tag: "Interview",
    action: "Reply needed",
  },
  {
    from: "Linear",
    subject: "3 issues assigned to you",
    time: "6:50 AM",
    tag: "Tasks",
    action: "Review required",
  },
];

const initialTasks = [
  { id: 1, text: "Review ENG-204 ticket", done: false },
  { id: 2, text: "Reply to Stripe interview email", done: false },
  { id: 3, text: "Download bank statement", done: true },
];

function PriorityRow({ email, onOpen }: { email: typeof mockPriority[0]; onOpen: (e: EmailItem) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onOpen({ ...email, preview: "" })}
      className="flex gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-foreground" />
      <div className="flex-1 min-w-0 ml-2">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold truncate">{email.from}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">{email.tag}</Badge>
          </div>
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-0.5 shrink-0"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success(`Replying to ${email.from}`); }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Reply className="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success(`Unsubscribed from ${email.from}`); }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <BellOff className="w-3 h-3 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success(`Snoozed email from ${email.from}`); }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <AlarmClock className="w-3 h-3 text-muted-foreground" />
                </button>
              </motion.div>
            ) : (
              <motion.span
                key="time"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] text-muted-foreground shrink-0"
              >
                {email.time}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1">{email.subject}</p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <CornerDownRight className="w-3 h-3 shrink-0" />
          <span className="font-medium">{email.action}</span>
        </div>
      </div>
    </div>
  );
}

export function PriorityWidget() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) { setAdding(false); return; }
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed, done: false }]);
    setInput("");
    setAdding(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-background/80 backdrop-blur-sm border shadow-lg flex flex-col" style={{ height: "440px" }}>
        <CardHeader className="pb-3 pt-4 px-4 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Priority</CardTitle>
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </CardHeader>

        <Separator className="shrink-0" />

        <CardContent className="px-4 pt-3 pb-4 flex flex-col flex-1 overflow-hidden gap-3">
          {/* Priority emails */}
          <div className="space-y-1 shrink-0">
            {mockPriority.map((email, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
              >
                <PriorityRow email={email} onOpen={setSelectedEmail} />
              </motion.div>
            ))}
          </div>

          <Separator className="shrink-0" />

          {/* Tasks section */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tasks</span>
              <button
                onClick={() => setAdding(true)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none space-y-1">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        task.done
                          ? "bg-foreground border-foreground"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {task.done && <Check className="w-2.5 h-2.5 text-background" />}
                    </button>
                    <span className={`text-xs flex-1 ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted transition-all"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {adding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2.5 px-2 py-1.5"
                  >
                    <div className="w-4 h-4 rounded border border-border shrink-0" />
                    <input
                      autoFocus
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTask();
                        if (e.key === "Escape") { setAdding(false); setInput(""); }
                      }}
                      onBlur={addTask}
                      placeholder="New task..."
                      className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmailModal
        email={selectedEmail}
        open={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />
    </motion.div>
  );
}
