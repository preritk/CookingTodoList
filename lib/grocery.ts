import {
  CATEGORY_ORDER,
  Category,
  DayPlan,
  GroceryGroup,
  GroceryLine,
} from "@/lib/types";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundQty(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Build the merged, servings-scaled grocery list for a plan. Quantities and
 * costs are scaled by servings / baseServings, lines with the same ingredient
 * name are merged, then grouped and ordered for a typical store layout.
 */
export function buildGroceryList(plan: DayPlan): GroceryGroup[] {
  const merged = new Map<string, GroceryLine>();

  for (const meal of plan.meals) {
    const { recipe } = meal;
    const scale = plan.constraints.servings / recipe.baseServings;

    for (const ing of recipe.ingredients) {
      const scaledQty = ing.qty * scale;
      const scaledCost = ing.cost * scale;
      const existing = merged.get(ing.name);

      if (!existing) {
        merged.set(ing.name, {
          name: ing.name,
          qty: scaledQty,
          unit: ing.unit,
          category: ing.category,
          cost: scaledCost,
        });
      } else {
        // Always sum cost; sum qty only when units match (keep first-seen unit).
        if (existing.unit === ing.unit) {
          existing.qty += scaledQty;
        }
        existing.cost += scaledCost;
      }
    }
  }

  // Group by category.
  const byCategory = new Map<Category, GroceryLine[]>();
  for (const line of merged.values()) {
    const rounded: GroceryLine = {
      ...line,
      qty: roundQty(line.qty),
      cost: roundMoney(line.cost),
    };
    const list = byCategory.get(line.category);
    if (list) list.push(rounded);
    else byCategory.set(line.category, [rounded]);
  }

  const groups: GroceryGroup[] = [];
  for (const category of CATEGORY_ORDER) {
    const items = byCategory.get(category);
    if (!items || items.length === 0) continue;
    items.sort((a, b) => a.name.localeCompare(b.name));
    const subtotal = roundMoney(items.reduce((sum, l) => sum + l.cost, 0));
    groups.push({ category, items, subtotal });
  }

  return groups;
}
