// ── Domain types ─────────────────────────────────────────────────────────────
// Single source of truth for the CookingTodoList app. Every module — seed data,
// pure logic in lib/*, the Zustand store, and all UI components — codes against
// these types.

export type MealSlot = "breakfast" | "lunch" | "dinner";

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

export type DietaryTag = "vegetarian" | "vegan" | "gluten-free" | "dairy-free";

export const DIETARY_TAGS: DietaryTag[] = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
];

export type Category =
  | "produce"
  | "meat-seafood"
  | "dairy"
  | "bakery"
  | "pantry"
  | "frozen"
  | "spices"
  | "beverages"
  | "other";

// Order used when grouping the grocery list (mirrors a typical store layout).
export const CATEGORY_ORDER: Category[] = [
  "produce",
  "meat-seafood",
  "dairy",
  "bakery",
  "frozen",
  "pantry",
  "spices",
  "beverages",
  "other",
];

/** One ingredient line on a recipe, costed at the recipe's `baseServings`. */
export interface RecipeIngredient {
  name: string;
  qty: number;
  unit: string; // e.g. "g", "ml", "cup", "tbsp", "unit"
  category: Category;
  cost: number; // USD for this qty at the recipe's baseServings
  role?: string; // culinary role, e.g. "protein", "fat", "acid", "binder"
}

export interface Recipe {
  id: string;
  name: string;
  slot: MealSlot;
  baseServings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  dietaryTags: DietaryTag[];
  prepTimeMin: number;
  image: string; // remote photo URL
  description?: string;
}

export interface Meal {
  slot: MealSlot;
  recipe: Recipe;
}

export interface Constraints {
  servings: number;
  budget: number; // USD cap for the day
  dietaryTags: DietaryTag[];
}

export interface DayPlan {
  date: string; // ISO yyyy-mm-dd
  meals: Meal[]; // one per slot
  constraints: Constraints;
}

/** A merged, servings-scaled line in the grocery list. */
export interface GroceryLine {
  name: string;
  qty: number;
  unit: string;
  category: Category;
  cost: number;
}

export interface GroceryGroup {
  category: Category;
  items: GroceryLine[];
  subtotal: number;
}

export type BudgetVerdict = "under" | "near" | "over";

export interface BudgetSummary {
  netCost: number;
  budget: number;
  verdict: BudgetVerdict;
  overage: number; // max(0, netCost - budget)
}

/** A raw substitution entry as stored in data/substitutions.json. */
export interface Substitution {
  name: string;
  cost: number; // USD per the original ingredient's qty/unit
  dietaryTags: DietaryTag[];
  role?: string;
}

/** A substitution surfaced to the UI, with the computed cost delta. */
export interface SubstitutionOption extends Substitution {
  costDelta: number; // altCost - originalCost (negative = cheaper)
}

export const DEFAULT_CONSTRAINTS: Constraints = {
  servings: 2,
  budget: 30,
  dietaryTags: [],
};
