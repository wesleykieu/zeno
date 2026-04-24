"use client";

import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const mockSchedule = [
  { time: "9:00 AM", title: "Standup", duration: "15m", type: "meeting" },
  { time: "11:00 AM", title: "Technical Interview — Stripe", duration: "1h", type: "important" },
  { time: "2:00 PM", title: "PR Review Session", duration: "30m", type: "meeting" },
  { time: "4:30 PM", title: "1:1 with Manager", duration: "30m", type: "meeting" },
];

export function ScheduleWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="bg-background/80 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Today</CardTitle>
            <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <CardDescription className="text-[11px]">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-4 pt-3 pb-4 space-y-3">
          {mockSchedule.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
              className="flex gap-2.5 items-start"
            >
              <div className={`w-0.5 self-stretch rounded-full mt-0.5 ${event.type === "important" ? "bg-foreground" : "bg-border"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium leading-tight truncate ${event.type === "important" ? "text-foreground" : "text-foreground/80"}`}>
                  {event.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{event.time} · {event.duration}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
