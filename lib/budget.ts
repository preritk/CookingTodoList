import { BudgetSummary, BudgetVerdict, GroceryGroup } from "@/lib/types";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Summarize the grocery cost against the day's budget. */
export function computeBudget(
  groups: GroceryGroup[],
  budget: number,
): BudgetSummary {
  const netCost = roundMoney(groups.reduce((sum, g) => sum + g.subtotal, 0));

  let verdict: BudgetVerdict;
  if (netCost <= budget) {
    verdict = "under";
  } else if (netCost <= budget * 1.1) {
    verdict = "near";
  } else {
    verdict = "over";
  }

  const overage = roundMoney(Math.max(0, netCost - budget));

  return { netCost, budget, verdict, overage };
}
