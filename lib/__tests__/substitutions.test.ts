import { describe, expect, it } from "vitest";
import { getSubstitutions } from "@/lib/substitutions";

describe("getSubstitutions", () => {
  it("excludes non-vegan alternatives when vegan is required", () => {
    // Ground beef -> Ground turkey (not vegan), Plant-based mince (vegan),
    // Brown lentils (vegan).
    const opts = getSubstitutions("Ground beef", 3.5, ["vegan"]);
    const names = opts.map((o) => o.name);

    expect(names).not.toContain("Ground turkey");
    expect(names).toContain("Plant-based mince");
    expect(names).toContain("Brown lentils");
  });

  it("returns all alternatives when no dietary tags required, cheapest first", () => {
    const opts = getSubstitutions("Ground beef", 3.5, []);
    const costs = opts.map((o) => o.cost);

    // Brown lentils 0.9, Ground turkey 2.6, Plant-based mince 3.2.
    expect(costs).toEqual([0.9, 2.6, 3.2]);
    expect(opts[0].name).toBe("Brown lentils");
  });

  it("computes costDelta with correct sign", () => {
    const opts = getSubstitutions("Ground beef", 3.5, []);
    const lentils = opts.find((o) => o.name === "Brown lentils")!;
    const mince = opts.find((o) => o.name === "Plant-based mince")!;

    expect(lentils.costDelta).toBe(-2.6); // 0.9 - 3.5, cheaper -> negative
    expect(mince.costDelta).toBeCloseTo(-0.3, 5); // 3.2 - 3.5
  });

  it("returns [] for an unknown ingredient", () => {
    expect(getSubstitutions("Unobtainium", 1, [])).toEqual([]);
  });
});
