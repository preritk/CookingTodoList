"use client";

import { motion } from "framer-motion";
import { usePlanStore } from "@/store/planStore";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Stepper } from "@/components/ui/Stepper";
import { DIETARY_TAGS } from "@/lib/types";

export function ConstraintsPanel() {
  const servings = usePlanStore((s) => s.constraints.servings);
  const budget = usePlanStore((s) => s.constraints.budget);
  const dietaryTags = usePlanStore((s) => s.constraints.dietaryTags);
  const setConstraints = usePlanStore((s) => s.setConstraints);
  const toggleDietaryTag = usePlanStore((s) => s.toggleDietaryTag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-charcoal">
          Today&apos;s constraints
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tune the plan to your table and your wallet.
        </p>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          {/* Servings */}
          <div className="flex flex-col gap-1.5">
            <Stepper
              label="Servings"
              value={servings}
              min={1}
              max={12}
              onChange={(v) => setConstraints({ servings: v })}
            />
          </div>

          {/* Budget cap */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Budget cap
            </span>
            <div className="inline-flex h-11 items-center rounded-full border border-line bg-surface pl-3.5 pr-2 transition-colors focus-within:border-terracotta/60 hover:border-terracotta/40">
              <span className="text-base font-semibold text-muted">$</span>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={Number.isFinite(budget) ? budget : ""}
                onChange={(e) => {
                  const next = e.target.valueAsNumber;
                  setConstraints({ budget: Number.isNaN(next) ? 0 : next });
                }}
                aria-label="Daily budget cap in dollars"
                className="w-20 bg-transparent px-1 text-base font-semibold text-charcoal outline-none tabular-nums"
              />
              <span className="pr-2 text-xs text-muted">/ day</span>
            </div>
          </div>

          {/* Dietary tags */}
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Dietary
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {DIETARY_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  active={dietaryTags.includes(tag)}
                  onClick={() => toggleDietaryTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
