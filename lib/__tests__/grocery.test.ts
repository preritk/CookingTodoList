import { describe, expect, it } from "vitest";
import { buildGroceryList } from "@/lib/grocery";
import { Constraints, DayPlan, Recipe } from "@/lib/types";

const constraints = (servings: number): Constraints => ({
  servings,
  budget: 30,
  dietaryTags: [],
});

function recipe(overrides: Partial<Recipe>): Recipe {
  return {
    id: "r",
    name: "Test",
    slot: "dinner",
    baseServings: 2,
    ingredients: [],
    steps: [],
    dietaryTags: [],
    prepTimeMin: 10,
    image: "",
    ...overrides,
  };
}

describe("buildGroceryList", () => {
  it("scales qty and cost by servings / baseServings", () => {
    const plan: DayPlan = {
      date: "2026-06-06",
      constraints: constraints(4), // 4 / 2 = 2x
      meals: [
        {
          slot: "dinner",
          recipe: recipe({
            baseServings: 2,
            ingredients: [
              { name: "Pasta", qty: 200, unit: "g", category: "pantry", cost: 0.6 },
            ],
          }),
        },
      ],
    };

    const groups = buildGroceryList(plan);
    const pantry = groups.find((g) => g.category === "pantry")!;
    const pasta = pantry.items.find((l) => l.name === "Pasta")!;

    expect(pasta.qty).toBe(400);
    expect(pasta.cost).toBe(1.2);
    expect(pantry.subtotal).toBe(1.2);
  });

  it("merges the same ingredient appearing across two meals", () => {
    const plan: DayPlan = {
      date: "2026-06-06",
      constraints: constraints(2), // 1x scale
      meals: [
        {
          slot: "lunch",
          recipe: recipe({
            id: "a",
            slot: "lunch",
            baseServings: 2,
            ingredients: [
              { name: "Garlic", qty: 2, unit: "clove", category: "produce", cost: 0.1 },
            ],
          }),
        },
        {
          slot: "dinner",
          recipe: recipe({
            id: "b",
            slot: "dinner",
            baseServings: 2,
            ingredients: [
              { name: "Garlic", qty: 3, unit: "clove", category: "produce", cost: 0.15 },
            ],
          }),
        },
      ],
    };

    const groups = buildGroceryList(plan);
    const produce = groups.find((g) => g.category === "produce")!;
    const garlic = produce.items.filter((l) => l.name === "Garlic");

    expect(garlic).toHaveLength(1);
    expect(garlic[0].qty).toBe(5);
    expect(garlic[0].cost).toBe(0.25);
  });
});
