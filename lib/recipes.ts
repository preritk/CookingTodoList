import { DietaryTag, MealSlot, Recipe } from "@/lib/types";
import recipesData from "@/data/recipes.json";

/** Load all seed recipes, typed as Recipe[]. */
export function loadRecipes(): Recipe[] {
  return recipesData as Recipe[];
}

/**
 * Keep recipes for the given slot that satisfy every required dietary tag.
 * A recipe satisfies a tag when its dietaryTags includes that tag.
 */
export function filterRecipes(
  recipes: Recipe[],
  slot: MealSlot,
  dietaryTags: DietaryTag[],
): Recipe[] {
  return recipes.filter(
    (recipe) =>
      recipe.slot === slot &&
      dietaryTags.every((tag) => recipe.dietaryTags.includes(tag)),
  );
}
