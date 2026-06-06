import { DietaryTag, Substitution, SubstitutionOption } from "@/lib/types";
import substitutionsData from "@/data/substitutions.json";

const SUBSTITUTIONS = substitutionsData as Record<string, Substitution[]>;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Look up substitutions for an ingredient, keep only those satisfying every
 * required dietary tag, attach the cost delta vs. the original, and sort
 * cheapest-first.
 */
export function getSubstitutions(
  ingredientName: string,
  originalCost: number,
  dietaryTags: DietaryTag[],
): SubstitutionOption[] {
  const alternatives = SUBSTITUTIONS[ingredientName] ?? [];

  return alternatives
    .filter((alt) => dietaryTags.every((tag) => alt.dietaryTags.includes(tag)))
    .map((alt) => ({
      ...alt,
      costDelta: roundMoney(alt.cost - originalCost),
    }))
    .sort((a, b) => a.cost - b.cost);
}
