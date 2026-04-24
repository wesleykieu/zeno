"use client";

import { useState } from "react";
import { Bold, Italic, Link, Paperclip, Send, Trash2, CornerUpLeft, CornerUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export type EmailItem = {
  from: string;
  subject: string;
  preview: string;
  time: string;
  tag: string;
  body?: string;
};

const mockBodies: Record<string, string> = {
  GitHub: `Hey,\n\nJust a heads-up that Pull Request #142 "feat: add auth flow" has been successfully merged into main by @teammate.\n\nThe branch has been closed and all associated checks have passed. You can view the full diff and any related issues on GitHub.\n\nThanks for your contribution.`,
  Stripe: `Hi Wesley,\n\nThank you for applying to the Software Engineer role at Stripe. We were impressed by your background and would love to schedule a call to learn more about you.\n\nPlease use the link below to pick a time that works best for you. The call will be about 30 minutes with our engineering team.\n\nLooking forward to speaking with you.`,
  Linear: `Hi Wesley,\n\nYou have been assigned 3 new issues:\n\n• ENG-204 — Refactor auth middleware (High Priority)\n• ENG-211 — Fix pagination bug in dashboard (High Priority)\n• ENG-219 — Update API rate limiting logic (High Priority)\n\nPlease review your queue and update statuses as you make progress. Let the team know if any blockers come up.`,
  Notion: `Hi there,\n\nYour weekly workspace digest is ready. Here's a quick summary of activity across your pages and databases this week:\n\n• 12 pages updated\n• 3 new databases created\n• 5 comments left by teammates\n\nHead over to your workspace to catch up on what you missed.`,
  Vercel: `Hey Wesley,\n\nYour latest deployment to production was successful. Here are the details:\n\n• Project: email-agent\n• Branch: main\n• Status: Ready\n• URL: your-project.vercel.app\n• Build time: 42s\n\nNo errors or warnings were detected during the build.`,
  Loom: `Hi Wesley,\n\nYour Loom recording "Onboarding walkthrough" was viewed 4 times today.\n\nConsider sharing it more broadly if it's been useful. You can also update the recording or add a call-to-action from your Loom dashboard.`,
  "Bank of America": `Dear Wesley Kieu,\n\nYour monthly statement for account ending in 4821 is now available.\n\nStatement period: March 1 – March 31\nOpening balance: $3,241.50\nClosing balance: $4,108.22\n\nPlease log in to your account to view or download the full statement.`,
};

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

interface EmailModalProps {
  email: EmailItem | null;
  open: boolean;
  onClose: () => void;
}

export function EmailModal({ email, open, onClose }: EmailModalProps) {
  const [reply, setReply] = useState("");
  const [mode, setMode] = useState<"view" | "reply" | "forward">("view");

  if (!email) return null;

  const body = mockBodies[email.from] ?? email.preview;

  function handleSend() {
    if (!reply.trim()) return;
    toast.success(`${mode === "forward" ? "Forwarded" : "Reply sent"} to ${email.from}`);
    setReply("");
    setMode("view");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setMode("view"); setReply(""); } }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4 pr-6">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-semibold text-foreground">
              {getInitials(email.from)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-sm font-semibold leading-tight mb-1">
                {email.subject}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-foreground">{email.from}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{email.time}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{email.tag}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Body */}
        <div className="px-6 py-5 max-h-56 overflow-y-auto scrollbar-none">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>

        <Separator />

        {/* Reply area */}
        <div className="px-6 pt-4 pb-5">
          {mode === "view" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("reply")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
                Reply
              </button>
              <button
                onClick={() => setMode("forward")}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
              >
                <CornerUpRight className="w-3.5 h-3.5" />
                Forward
              </button>
              <button
                onClick={() => { toast.success(`Moved to trash`); onClose(); }}
                className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
              <div className="px-4 pt-1 pb-0.5">
                <p className="text-[11px] text-muted-foreground pt-2">
                  {mode === "reply" ? `Reply to ${email.from}` : `Forward email`}
                </p>
              </div>
              <textarea
                autoFocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={mode === "reply" ? "Write your reply..." : "Add recipients and a message..."}
                rows={4}
                className="w-full px-4 py-3 text-sm bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground"
              />
              <Separator />
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-0.5">
                  <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <Link className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setMode("view"); setReply(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity font-medium"
                  >
                    <Send className="w-3 h-3" />
                    {mode === "reply" ? "Send" : "Forward"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
