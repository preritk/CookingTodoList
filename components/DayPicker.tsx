"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePlanStore } from "@/store/planStore";

/** Format an ISO yyyy-mm-dd string into a friendly weekday + date label. */
function formatFriendly(iso: string): { weekday: string; rest: string } | null {
  if (!iso) return null;
  // Parse as a local date (avoid UTC shift from `new Date("yyyy-mm-dd")`).
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: "long" }),
    rest: date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function DayPicker() {
  const date = usePlanStore((s) => s.date);
  const setDate = usePlanStore((s) => s.setDate);

  const friendly = useMemo(() => formatFriendly(date), [date]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      <label className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2.5 shadow-[var(--shadow-soft)] transition-colors focus-within:border-terracotta/60 hover:border-terracotta/40">
        <span
          aria-hidden
          className="text-lg leading-none transition-transform group-hover:scale-110"
        >
          📅
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">
            Planning for
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="cursor-pointer bg-transparent text-sm font-semibold text-charcoal outline-none tabular-nums [color-scheme:light]"
          />
        </span>
      </label>

      {friendly && (
        <motion.div
          key={date}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col leading-tight"
        >
          <span className="font-display text-lg font-semibold text-charcoal">
            {friendly.weekday}
          </span>
          <span className="text-sm text-muted">{friendly.rest}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
