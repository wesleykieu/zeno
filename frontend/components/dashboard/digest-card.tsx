"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowUpRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmailModal, type EmailItem } from "@/components/dashboard/email-modal";

const mockEmails = [
  {
    from: "GitHub",
    subject: "Your pull request was merged into main",
    preview: "The PR #142 'feat: add auth flow' was successfully merged by @teammate.",
    time: "8:42 AM",
    tag: "Dev",
    unread: true,
  },
  {
    from: "Notion",
    subject: "Your weekly digest is ready",
    preview: "Here's a summary of everything that happened in your workspace this week.",
    time: "7:15 AM",
    tag: "Update",
    unread: true,
  },
  {
    from: "Linear",
    subject: "3 issues have been assigned to you",
    preview: "ENG-204, ENG-211, ENG-219 are now in your queue and marked high priority.",
    time: "6:50 AM",
    tag: "Tasks",
    unread: false,
  },
  {
    from: "Stripe",
    subject: "Interview invitation — Software Engineer",
    preview: "We'd love to schedule a call to discuss your application. Please pick a time.",
    time: "Yesterday",
    tag: "Important",
    unread: true,
  },
  {
    from: "Vercel",
    subject: "Deployment successful: production",
    preview: "Your latest push to main was deployed successfully to vercel.app.",
    time: "Yesterday",
    tag: "Dev",
    unread: false,
  },
  {
    from: "Loom",
    subject: "Someone viewed your video",
    preview: "Your recording 'Onboarding walkthrough' was viewed 4 times today.",
    time: "Yesterday",
    tag: "Update",
    unread: false,
  },
];

const PER_PAGE = 3;

export function DigestCard() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const totalPages = Math.ceil(mockEmails.length / PER_PAGE);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setPage((p) => (p + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleEmails = mockEmails.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);


  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[520px]"
    >
      <Card className="bg-background/80 backdrop-blur-sm border shadow-lg" style={{ height: "440px" }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Today's Digest</CardTitle>
              <CardDescription className="text-xs mt-0.5">{today}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Mock</Badge>
              <span className="text-xs text-muted-foreground">
                {mockEmails.filter((e) => e.unread).length} unread
              </span>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {mockEmails.length} emails today
            </span>
          </div>

          <div className="relative overflow-hidden h-[246px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                initial={{ opacity: 0, y: direction * 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -12 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-1"
              >
                {visibleEmails.map((email, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedEmail(email)}
                    className="flex gap-4 p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col items-center pt-1.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${email.unread ? "bg-foreground" : "bg-transparent border border-border"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${email.unread ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                            {email.from}
                          </span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{email.tag}</Badge>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] text-muted-foreground">{email.time}</span>
                          <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <p className={`text-sm truncate ${email.unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{email.preview}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > page ? 1 : -1); setPage(i); }}
                className={`rounded-full transition-all duration-300 ${i === page ? "w-4 h-1.5 bg-foreground" : "w-1.5 h-1.5 bg-muted-foreground/30"}`}
              />
            ))}
          </div>

          <Separator className="mt-4" />

          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated just now</span>
            </div>
            <span>{mockEmails.filter((e) => e.unread).length} unread · {mockEmails.length} total</span>
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
