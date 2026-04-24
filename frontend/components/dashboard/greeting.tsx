"use client";

import { motion } from "motion/react";

export function Greeting({ name = "Good Evening, Wesley" }: { name?: string }) {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pb-2"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {name}.
      </h2>
      <p className="text-sm text-muted-foreground mt-1">{date}</p>
    </motion.div>
  );
}
