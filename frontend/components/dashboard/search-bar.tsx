"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

export function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[520px]"
    >
      <motion.div
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-background/80 backdrop-blur-sm shadow-sm transition-shadow ${
          focused ? "shadow-md ring-1 ring-border" : ""
        }`}
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search emails, senders, files, and more..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
        />
        <kbd className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 shrink-0">
          ⌘K
        </kbd>
      </motion.div>
    </motion.div>
  );
}
