# CookingTodoList

A day-based meal planner. Pick a day, set your servings, budget and dietary
needs, and get a full **breakfast / lunch / dinner** plan with a consolidated
**grocery list**, dietary-aware **substitutions**, and a live **budget
feasibility** check.

## Features

- **Day-based planning** — pick a date; your plan and constraints persist in `localStorage`.
- **Meal generation** — breakfast, lunch and dinner from a seeded recipe library, honoring dietary tags (vegetarian / vegan / gluten-free / dairy-free). Reroll any single meal.
- **Auto grocery list** — ingredients merged across meals, scaled to servings, grouped by store category with subtotals.
- **Substitutions** — per-ingredient swaps that respect your diet, each showing the cost delta.
- **Budget feasibility** — live running total vs. your cap, color-coded Under / Near / Over.
- Polished, appetizing UI with food photography and Framer Motion animations.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand · Framer Motion. No backend — seeded JSON data in `data/`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # unit tests for the pure logic (grocery / budget / substitutions / plan)
```

## Structure

- `lib/` — domain types and pure logic (recipes, plan generation, grocery aggregation, budget, substitutions, persistence)
- `data/` — seeded `recipes.json` and `substitutions.json`
- `store/planStore.ts` — single source of truth (Zustand); grocery list and budget derive from it
- `components/` — UI (meal cards, grocery list, budget banner, constraints, substitution modal) + `ui/` primitives
- `docs/PRODUCT_PLAN.md` — product/UX plan and user stories
