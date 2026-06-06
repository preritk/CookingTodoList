"use client";

import { useMemo } from "react";
import { create } from "zustand";
import {
  Constraints,
  DayPlan,
  DietaryTag,
  GroceryGroup,
  BudgetSummary,
  MealSlot,
  SubstitutionOption,
  DEFAULT_CONSTRAINTS,
} from "@/lib/types";
import { generateDayPlan, rerollMeal } from "@/lib/generatePlan";
import { buildGroceryList } from "@/lib/grocery";
import { computeBudget } from "@/lib/budget";
import {
  loadConstraints,
  loadDayPlan,
  saveConstraints,
  saveDayPlan,
} from "@/lib/persistence";

interface PlanState {
  date: string;
  constraints: Constraints;
  dayPlan: DayPlan | null;
  hydrated: boolean;

  /** Set the active date and load any saved plan/constraints for it. */
  hydrate: (date: string) => void;
  setDate: (date: string) => void;
  setConstraints: (patch: Partial<Constraints>) => void;
  toggleDietaryTag: (tag: DietaryTag) => void;
  generate: () => void;
  reroll: (slot: MealSlot) => void;
  applySubstitution: (
    slot: MealSlot,
    ingredientName: string,
    alt: SubstitutionOption,
  ) => void;
  clearPlan: () => void;
}

function persist(state: PlanState) {
  saveConstraints(state.constraints);
  if (state.dayPlan) saveDayPlan(state.dayPlan);
}

export const usePlanStore = create<PlanState>((set, get) => ({
  date: "",
  constraints: DEFAULT_CONSTRAINTS,
  dayPlan: null,
  hydrated: false,

  hydrate: (date) => {
    const savedConstraints = loadConstraints() ?? DEFAULT_CONSTRAINTS;
    const savedPlan = loadDayPlan(date);
    set({
      date,
      constraints: savedConstraints,
      dayPlan: savedPlan,
      hydrated: true,
    });
  },

  setDate: (date) => {
    const savedPlan = loadDayPlan(date);
    set({ date, dayPlan: savedPlan });
  },

  setConstraints: (patch) => {
    set((s) => ({ constraints: { ...s.constraints, ...patch } }));
    persist(get());
  },

  toggleDietaryTag: (tag) => {
    set((s) => {
      const has = s.constraints.dietaryTags.includes(tag);
      const dietaryTags = has
        ? s.constraints.dietaryTags.filter((t) => t !== tag)
        : [...s.constraints.dietaryTags, tag];
      return { constraints: { ...s.constraints, dietaryTags } };
    });
    persist(get());
  },

  generate: () => {
    const { date, constraints } = get();
    const day = date || new Date().toISOString().slice(0, 10);
    const plan = generateDayPlan(day, constraints);
    set({ date: day, dayPlan: plan });
    persist(get());
  },

  reroll: (slot) => {
    const { dayPlan } = get();
    if (!dayPlan) return;
    set({ dayPlan: rerollMeal(dayPlan, slot) });
    persist(get());
  },

  applySubstitution: (slot, ingredientName, alt) => {
    const { dayPlan } = get();
    if (!dayPlan) return;
    const meals = dayPlan.meals.map((meal) => {
      if (meal.slot !== slot) return meal;
      const ingredients = meal.recipe.ingredients.map((ing) =>
        ing.name === ingredientName
          ? { ...ing, name: alt.name, cost: alt.cost, role: alt.role ?? ing.role }
          : ing,
      );
      return { ...meal, recipe: { ...meal.recipe, ingredients } };
    });
    set({ dayPlan: { ...dayPlan, meals } });
    persist(get());
  },

  clearPlan: () => {
    set({ dayPlan: null });
  },
}));

// ── Derived selectors (memoized in the component tree) ──────────────────────

export function useGroceryList(): GroceryGroup[] {
  const dayPlan = usePlanStore((s) => s.dayPlan);
  return useMemo(() => (dayPlan ? buildGroceryList(dayPlan) : []), [dayPlan]);
}

export function useBudgetSummary(): BudgetSummary {
  const groups = useGroceryList();
  const budget = usePlanStore((s) => s.constraints.budget);
  return useMemo(() => computeBudget(groups, budget), [groups, budget]);
}
