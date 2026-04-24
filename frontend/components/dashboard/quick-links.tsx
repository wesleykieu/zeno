"use client";

import { motion } from "motion/react";
import { Mail, Calendar, Github, MessageSquare, FileText, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const links = [
  {
    label: "Gmail",
    icon: Mail,
    href: "https://mail.google.com",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "https://calendar.google.com",
  },
  {
    label: "Notion",
    icon: FileText,
    href: "https://notion.so",
  },
  {
    label: "GitHub",
    icon: Github,
    href: "https://github.com",
  },
  {
    label: "Slack",
    icon: MessageSquare,
    href: "https://slack.com",
  },
];

export function QuickLinks() {
  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="flex items-center gap-0.5"
      >
        {links.map(({ label, icon: Icon, href }, i) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.25 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs flex items-center gap-1.5">
              {label}
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
