"use client";

import { motion } from "motion/react";
import { Mail, Hash, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function GmailLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
      <rect x="5" y="10" width="22" height="14" rx="1" fill="#F8F8F8"/>
      <path d="M5 10l11 8.5L27 10" stroke="#EA4335" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="5" y1="10" x2="5" y2="24" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="27" y1="10" x2="27" y2="24" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5" y1="24" x2="27" y2="24" stroke="#FBBC04" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SlackLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#4A154B"/>
      <line x1="12" y1="8" x2="10.5" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="19" y1="8" x2="17.5" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="8" y1="12.5" x2="24" y2="12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="8" y1="19.5" x2="24" y2="19.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

type DigestItem = {
  source: "email" | "slack";
  from: string;
  channel?: string;
  subject: string;
  preview: string;
  time: string;
  tag: string;
  priority: boolean;
};

const mockItems: DigestItem[] = [
  {
    source: "email",
    from: "Stripe",
    subject: "Interview invitation — Software Engineer",
    preview: "We'd love to schedule a call to discuss your application. Please pick a time.",
    time: "6:50 AM",
    tag: "Important",
    priority: true,
  },
  {
    source: "slack",
    from: "Alex Chen",
    channel: "#engineering",
    subject: "@you The deploy looks great — can you double-check staging?",
    preview: "Mentioned you in #engineering",
    time: "8:12 AM",
    tag: "Mention",
    priority: true,
  },
  {
    source: "email",
    from: "Linear",
    subject: "ENG-204 due today — Authentication refactor",
    preview: "High priority task marked due end of day. Current status: In Progress.",
    time: "7:30 AM",
    tag: "Task",
    priority: true,
  },
  {
    source: "slack",
    from: "Jordan",
    channel: "#team-sync",
    subject: "Reminder: 3pm standup includes sprint review today",
    preview: "Posted in #team-sync",
    time: "9:00 AM",
    tag: "Meeting",
    priority: false,
  },
  {
    source: "email",
    from: "GitHub",
    subject: "PR #142 'feat: add auth flow' was merged",
    preview: "Merged by @teammate into main. 3 checks passed.",
    time: "8:42 AM",
    tag: "Dev",
    priority: false,
  },
  {
    source: "slack",
    from: "Sarah",
    channel: "#general",
    subject: "All-hands moved to Thursday 4pm — update your calendars",
    preview: "Posted by Sarah (CEO) in #general",
    time: "Yesterday",
    tag: "Announce",
    priority: false,
  },
];

export function DigestCard() {
  const priorityCount = mockItems.filter((i) => i.priority).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[640px] h-full"
    >
      <Card className="h-full flex flex-col bg-background/80 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Today's Digest</CardTitle>
              <CardDescription className="text-xs mt-0.5">{today}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative" title="Gmail connected">
                <GmailLogo size={24} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
              </div>
              <div className="relative" title="Slack connected">
                <SlackLogo size={24} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-3 px-6 min-h-0 overflow-hidden">

          <div className="flex items-center gap-2 mb-2 shrink-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {priorityCount} priority &middot; {mockItems.length} total signals
            </span>
          </div>

          <Separator className="mb-3 shrink-0" />

          {/* Scrollable feed — grows to fill whatever height the card has */}
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-y-auto scrollbar-none space-y-0.5 pr-1">
              {mockItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
                  className="flex gap-3 px-2.5 py-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  <div className="pt-0.5 shrink-0">
                    {item.source === "email" ? (
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                        <Mail className="w-3 h-3 text-red-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center">
                        <Hash className="w-3 h-3 text-purple-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${item.priority ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.source === "slack" ? item.channel : item.from}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          {item.tag}
                        </Badge>
                        {item.priority && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] text-muted-foreground">{item.time}</span>
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{item.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{item.preview}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent pointer-events-none rounded-b-lg" />
          </div>

          <Separator className="mt-3 shrink-0" />

          <div className="flex items-center justify-between pt-2.5 pb-1 text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated just now</span>
            </div>
            <span>{priorityCount} priority &middot; {mockItems.length} signals today</span>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
