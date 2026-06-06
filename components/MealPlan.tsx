"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MealCard } from "@/components/MealCard";
import { usePlanStore } from "@/store/planStore";
import { MEAL_SLOTS } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function MealPlan() {
  const dayPlan = usePlanStore((s) => s.dayPlan);

  if (!dayPlan) return null;

  // Order meals by canonical slot order regardless of store ordering.
  const meals = MEAL_SLOTS.map((slot) =>
    dayPlan.meals.find((m) => m.slot === slot),
  ).filter((m): m is NonNullable<typeof m> => m != null);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      {meals.map((meal) => (
        <motion.div key={meal.slot} variants={item} className="min-h-0">
          {/* Cross-fade the card content when the recipe is rerolled. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={meal.recipe.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full"
            >
              <MealCard meal={meal} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
