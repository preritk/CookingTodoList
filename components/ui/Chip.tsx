"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  /** Render as a static label rather than a toggle button. */
  as?: "button" | "span";
}

/** Pill used for dietary tags, filters and small labels. */
export function Chip({
  children,
  active = false,
  onClick,
  className,
  as = onClick ? "button" : "span",
}: ChipProps) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize",
    "border transition-colors",
    active
      ? "bg-herb text-white border-herb"
      : "bg-shell text-muted border-line hover:border-herb/40 hover:text-charcoal",
    onClick && "cursor-pointer",
    className,
  );

  if (as === "span") {
    return <span className={classes}>{children}</span>;
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
