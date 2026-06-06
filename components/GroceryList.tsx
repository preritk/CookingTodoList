"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useGroceryList } from "@/store/planStore";
import { categoryIcon, categoryLabel, money } from "@/lib/format";

export function GroceryList() {
  const groups = useGroceryList();

  const total = groups.reduce((sum, g) => sum + g.subtotal, 0);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Grocery List
        </h2>
        {groups.length > 0 && (
          <motion.span
            key={total}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-shell px-3 py-1 text-sm font-semibold text-charcoal tabular-nums"
          >
            {money(total)}
          </motion.span>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <span aria-hidden className="text-4xl">
            🛒
          </span>
          <p className="font-display text-base font-semibold text-charcoal">
            Your cart is empty
          </p>
          <p className="text-sm text-muted">
            Plan some meals and your shopping list will appear here.
          </p>
        </div>
      ) : (
        <motion.div layout className="flex flex-col gap-6">
          <AnimatePresence initial={false} mode="popLayout">
            {groups.map((group) => (
              <motion.section
                key={group.category}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                    <span aria-hidden className="text-base">
                      {categoryIcon(group.category)}
                    </span>
                    {categoryLabel(group.category)}
                  </h3>
                  <span className="text-sm font-medium text-muted tabular-nums">
                    {money(group.subtotal)}
                  </span>
                </div>

                <ul className="flex flex-col divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {group.items.map((line) => (
                      <motion.li
                        key={line.name}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="flex items-center justify-between gap-3 overflow-hidden py-2"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm capitalize text-charcoal">
                          {line.name}
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-muted">
                          {+line.qty.toFixed(2)} {line.unit}
                        </span>
                        <span className="w-16 shrink-0 text-right text-sm font-medium tabular-nums text-charcoal">
                          {money(line.cost)}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Card>
  );
}
