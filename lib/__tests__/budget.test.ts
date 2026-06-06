import { describe, expect, it } from "vitest";
import { computeBudget } from "@/lib/budget";
import { GroceryGroup } from "@/lib/types";

function groups(subtotal: number): GroceryGroup[] {
  return [{ category: "pantry", items: [], subtotal }];
}

describe("computeBudget", () => {
  it("is 'under' when netCost == budget (lower edge)", () => {
    const summary = computeBudget(groups(30), 30);
    expect(summary.netCost).toBe(30);
    expect(summary.verdict).toBe("under");
    expect(summary.overage).toBe(0);
  });

  it("is 'under' when netCost is below budget", () => {
    expect(computeBudget(groups(25), 30).verdict).toBe("under");
  });

  it("is 'near' just over budget", () => {
    expect(computeBudget(groups(30.5), 30).verdict).toBe("near");
  });

  it("is 'near' at the exact +10% edge (netCost == budget * 1.10)", () => {
    const summary = computeBudget(groups(33), 30); // 30 * 1.10 = 33
    expect(summary.verdict).toBe("near");
    expect(summary.overage).toBe(3);
  });

  it("is 'over' just above budget * 1.10", () => {
    const summary = computeBudget(groups(33.01), 30);
    expect(summary.verdict).toBe("over");
    expect(summary.overage).toBe(3.01);
  });
});
