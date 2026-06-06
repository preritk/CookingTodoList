"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

/** Surface container with the app's soft shadow + rounded-card radius. */
export function Card({ interactive, className, children, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-[var(--radius-card)] bg-surface border border-line",
        "shadow-[var(--shadow-soft)]",
        interactive && "transition-shadow hover:shadow-[var(--shadow-lift)]",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
