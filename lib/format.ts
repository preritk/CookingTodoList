import { Category, MealSlot } from "@/lib/types";

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

const CATEGORY_LABELS: Record<Category, string> = {
  produce: "Produce",
  "meat-seafood": "Meat & Seafood",
  dairy: "Dairy",
  bakery: "Bakery",
  pantry: "Pantry",
  frozen: "Frozen",
  spices: "Spices",
  beverages: "Beverages",
  other: "Other",
};

export function categoryLabel(c: Category): string {
  return CATEGORY_LABELS[c] ?? c;
}

const CATEGORY_ICONS: Record<Category, string> = {
  produce: "🥬",
  "meat-seafood": "🐟",
  dairy: "🧀",
  bakery: "🥖",
  pantry: "🫙",
  frozen: "🧊",
  spices: "🧂",
  beverages: "🥤",
  other: "🛒",
};

export function categoryIcon(c: Category): string {
  return CATEGORY_ICONS[c] ?? "🛒";
}

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export function slotLabel(s: MealSlot): string {
  return SLOT_LABELS[s];
}

const SLOT_ICONS: Record<MealSlot, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
};

export function slotIcon(s: MealSlot): string {
  return SLOT_ICONS[s];
}
