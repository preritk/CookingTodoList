"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "@/store/planStore";
import { DayPicker } from "@/components/DayPicker";
import { ConstraintsPanel } from "@/components/ConstraintsPanel";
import { BudgetBanner } from "@/components/BudgetBanner";
import { MealPlan } from "@/components/MealPlan";
import { GroceryList } from "@/components/GroceryList";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const hydrated = usePlanStore((s) => s.hydrated);
  const dayPlan = usePlanStore((s) => s.dayPlan);
  const hydrate = usePlanStore((s) => s.hydrate);
  const generate = usePlanStore((s) => s.generate);

  // Hydrate from localStorage with today's date on first client render.
  useEffect(() => {
    if (!hydrated) hydrate(new Date().toISOString().slice(0, 10));
  }, [hydrated, hydrate]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-40 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-terracotta"
        >
          <span className="text-2xl">🍳</span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            CookingTodoList
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-tight sm:text-5xl"
        >
          Plan your day, deliciously.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-xl text-muted"
        >
          Pick a day, set your budget and diet, and get a full breakfast, lunch
          and dinner plan with a smart grocery list and easy substitutions.
        </motion.p>
      </header>

      {/* Setup controls */}
      <div className="mb-6 flex flex-col gap-4">
        <DayPicker />
        <ConstraintsPanel />
        <div className="flex justify-center sm:justify-start">
          <Button size="lg" onClick={generate}>
            <span>{dayPlan ? "🔄 Regenerate plan" : "✨ Generate my plan"}</span>
          </Button>
        </div>
      </div>

      {/* Loading skeleton before hydration */}
      {!hydrated && <PlannerSkeleton />}

      {/* Results / empty state */}
      {hydrated && (
        <AnimatePresence mode="wait">
          {dayPlan ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]"
            >
              <section>
                <SectionTitle>Your meal plan</SectionTitle>
                <MealPlan />
              </section>
              <section>
                <SectionTitle>Shopping</SectionTitle>
                <GroceryList />
              </section>
            </motion.div>
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      )}

      {/* Persistent budget banner */}
      {hydrated && dayPlan && <BudgetBanner />}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-display text-xl font-semibold text-charcoal">
      {children}
    </h2>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line bg-surface/60 px-6 py-20 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
        className="mb-4 text-6xl"
      >
        🥘
      </motion.div>
      <h3 className="font-display text-2xl font-semibold">No plan yet</h3>
      <p className="mt-2 max-w-sm text-muted">
        Set your servings, budget and any dietary needs above, then hit{" "}
        <span className="font-medium text-terracotta">Generate my plan</span> to
        cook up breakfast, lunch and dinner for the day.
      </p>
    </motion.div>
  );
}

function PlannerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-[var(--radius-card)] bg-shell"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-shell" />
    </div>
  );
}
