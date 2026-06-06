import { describe, expect, it } from "vitest";
import { generateDayPlan, rerollMeal } from "@/lib/generatePlan";
import { Constraints, MEAL_SLOTS } from "@/lib/types";

const veganConstraints: Constraints = {
  servings: 2,
  budget: 30,
  dietaryTags: ["vegan"],
};

describe("generateDayPlan", () => {
  it("returns one meal per slot honoring a dietary tag", () => {
    const plan = generateDayPlan("2026-06-06", veganConstraints);

    expect(plan.date).toBe("2026-06-06");
    expect(plan.meals).toHaveLength(3);
    expect(plan.meals.map((m) => m.slot)).toEqual(MEAL_SLOTS);

    for (const meal of plan.meals) {
      expect(meal.recipe.slot).toBe(meal.slot);
      // Every slot has a vegan option in the seed data, so the tag must hold.
      expect(meal.recipe.dietaryTags).toContain("vegan");
    }
  });
});

describe("rerollMeal", () => {
  it("changes only the target slot and keeps others identical", () => {
    const plan = generateDayPlan("2026-06-06", veganConstraints);
    const next = rerollMeal(plan, "lunch");

    // Untouched slots keep the same recipe reference / id.
    for (const slot of ["breakfast", "dinner"] as const) {
      const before = plan.meals.find((m) => m.slot === slot)!.recipe.id;
      const after = next.meals.find((m) => m.slot === slot)!.recipe.id;
      expect(after).toBe(before);
    }

    // Lunch has multiple vegan options, so the reroll must yield a different id.
    const beforeLunch = plan.meals.find((m) => m.slot === "lunch")!.recipe.id;
    const afterLunch = next.meals.find((m) => m.slot === "lunch")!.recipe.id;
    expect(afterLunch).not.toBe(beforeLunch);

    // Returns a new plan object, not a mutation of the original.
    expect(next).not.toBe(plan);
  });
});
