import { Constraints, DayPlan, Meal, MealSlot, MEAL_SLOTS, Recipe } from "@/lib/types";
import { filterRecipes, loadRecipes } from "@/lib/recipes";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Pick one eligible recipe for a slot, falling back to any slot recipe when over-constrained. */
function pickForSlot(
  recipes: Recipe[],
  slot: MealSlot,
  constraints: Constraints,
): Recipe {
  const eligible = filterRecipes(recipes, slot, constraints.dietaryTags);
  if (eligible.length > 0) return pickRandom(eligible);
  const anyForSlot = recipes.filter((r) => r.slot === slot);
  return pickRandom(anyForSlot);
}

/** Build a day plan picking one recipe per meal slot. */
export function generateDayPlan(date: string, constraints: Constraints): DayPlan {
  const recipes = loadRecipes();
  const meals: Meal[] = MEAL_SLOTS.map((slot) => ({
    slot,
    recipe: pickForSlot(recipes, slot, constraints),
  }));
  return { date, meals, constraints };
}

/**
 * Return a NEW plan where only `slot`'s meal is replaced with a different
 * eligible recipe (different id than the current one when more than one is
 * available). Other slots are untouched.
 */
export function rerollMeal(plan: DayPlan, slot: MealSlot): DayPlan {
  const recipes = loadRecipes();
  const current = plan.meals.find((m) => m.slot === slot)?.recipe;

  let eligible = filterRecipes(recipes, slot, plan.constraints.dietaryTags);
  if (eligible.length === 0) {
    eligible = recipes.filter((r) => r.slot === slot);
  }

  // Prefer a recipe different from the current one when alternatives exist.
  const others = current
    ? eligible.filter((r) => r.id !== current.id)
    : eligible;
  const pool = others.length > 0 ? others : eligible;
  const next = pickRandom(pool);

  const meals = plan.meals.map((meal) =>
    meal.slot === slot ? { slot, recipe: next } : meal,
  );
  return { ...plan, meals };
}
