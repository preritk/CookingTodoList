"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useBudgetSummary } from "@/store/planStore";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { BudgetVerdict } from "@/lib/types";

const VERDICT_META: Record<
  BudgetVerdict,
  { label: string; pill: string; ring: string; emoji: string }
> = {
  under: {
    label: "Under budget",
    pill: "bg-herb text-white border-herb",
    ring: "border-herb/30",
    emoji: "🥗",
  },
  near: {
    label: "Almost there",
    pill: "bg-amber text-white border-amber",
    ring: "border-amber/40",
    emoji: "⚖️",
  },
  over: {
    label: "Over budget",
    pill: "bg-tomato text-white border-tomato",
    ring: "border-tomato/40",
    emoji: "🔥",
  },
};

export function BudgetBanner() {
  const { netCost, budget, verdict, overage } = useBudgetSummary();
  const meta = VERDICT_META[verdict];

  return (
    <motion.div
      // Gentle pulse whenever the verdict changes.
      key={verdict}
      initial={{ scale: 0.985, opacity: 0.85 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
        "rounded-[var(--radius-card)] border bg-surface px-5 py-4 shadow-[var(--shadow-soft)] sm:px-6",
        meta.ring,
      )}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-muted">Running total</span>
        <span className="flex items-baseline font-display text-2xl font-semibold tabular-nums text-charcoal sm:text-3xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={netCost.toFixed(2)}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0, position: "absolute" }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            >
              {money(netCost)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-sm text-muted">
          of <span className="tabular-nums">{money(budget)}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <AnimatePresence initial={false}>
          {verdict === "over" && overage > 0 && (
            <motion.span
              key="overage"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-sm font-medium tabular-nums text-tomato"
            >
              +{money(overage)} over
            </motion.span>
          )}
        </AnimatePresence>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            meta.pill,
          )}
        >
          <span aria-hidden>{meta.emoji}</span>
          {meta.label}
        </span>
      </div>
    </motion.div>
  );
}
