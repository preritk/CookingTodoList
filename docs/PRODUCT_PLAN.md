# CookingTodoList — Product Plan

A day-based meal planning web app. The user picks a day (or a date range), and the app
walks them through a structured flow that produces four core outputs:

1. **Meal plan** — breakfast / lunch / dinner for the chosen day(s)
2. **Grocery list** — consolidated, de-duplicated ingredients to buy
3. **Substitutions** — alternatives for missing, disliked, or out-of-budget ingredients
4. **Budget feasibility** — does this plan fit the user's budget, and what to change if not

---

## 1. Core Concept

The app is organized around a **day**. The user lands on a day, sets a few constraints
(servings, budget, dietary needs, pantry), and the app generates a full day's plan that
flows downstream into a grocery list, substitution suggestions, and a budget check. Each
output feeds the next, so changes ripple through (e.g. swapping an ingredient updates the
grocery list and the budget total live).

### Key entities

| Entity | Description |
|---|---|
| **Day Plan** | A date + its three meals + derived grocery list + budget summary |
| **Meal** | breakfast / lunch / dinner → references one Recipe |
| **Recipe** | name, servings, ingredients[], steps, est. cost, dietary tags, prep time |
| **Ingredient** | name, quantity, unit, category (produce/dairy/…), unit cost |
| **Pantry Item** | ingredient the user already owns (excluded from grocery list) |
| **Substitution** | originalIngredient → alternative, reason, cost delta |
| **Budget** | target amount + computed plan cost + feasibility verdict |

---

## 2. User Experience Flow

```
┌──────────────┐
│ 1. Pick Day  │  Select date (default: today). See empty/draft plan.
└──────┬───────┘
       │
┌──────▼───────────────┐
│ 2. Set Constraints   │  Servings, budget cap, dietary tags (veg/vegan/GF/etc.),
│                      │  cuisine prefs, max prep time, pantry (what I already have).
└──────┬───────────────┘
       │
┌──────▼───────────────┐
│ 3. Generate Plan     │  App proposes Breakfast / Lunch / Dinner recipes that
│   (B / L / D)        │  honor the constraints. User can lock, reroll, or swap each meal.
└──────┬───────────────┘
       │
┌──────▼───────────────┐
│ 4. Review Grocery    │  Auto-built from all 3 meals: ingredients merged, pantry
│    List              │  items removed, grouped by store category, with quantities.
└──────┬───────────────┘
       │
┌──────▼───────────────┐
│ 5. Budget Check      │  Live total vs. budget cap. Green (under) / Amber (close) /
│                      │  Red (over). If over → surface savings via substitutions.
└──────┬───────────────┘
       │
┌──────▼───────────────┐
│ 6. Substitutions     │  Per-ingredient swaps: cheaper option, dietary-safe option,
│                      │  or "out of stock / don't have it" option. Each shows cost delta.
└──────┬───────────────┘
       │
┌──────▼───────────────┐
│ 7. Finalize & Track  │  Confirm the day. Grocery list becomes a checkable todo list.
│   (Todo)             │  Mark items bought; mark meals as cooked.
└──────────────────────┘
```

### Flow principles
- **Non-linear edits allowed.** From any step the user can jump back; the four outputs
  recompute automatically (single source of truth = the Day Plan).
- **Budget is always visible.** A persistent banner/sidebar shows running cost vs. cap.
- **Substitutions are contextual.** They appear both as a dedicated step and inline
  (a "swap" affordance next to each ingredient and each meal).

---

## 3. User Stories

Grouped by epic, with acceptance criteria. Priority: **P0** = MVP, **P1** = next, **P2** = later.

### Epic A — Day & Plan Setup
- **A1 (P0)** As a user, I can select a day so that I can plan meals for that date.
  - *AC:* Date picker defaults to today; selecting a date loads or creates its plan.
- **A2 (P0)** As a user, I can set servings and a budget cap so the plan matches my needs.
  - *AC:* Budget and servings persist on the Day Plan and drive cost/quantity calcs.
- **A3 (P0)** As a user, I can specify dietary restrictions and preferences so suggested
  recipes are relevant.
  - *AC:* Selecting "vegetarian" excludes meat recipes from suggestions.
- **A4 (P1)** As a user, I can list pantry items I already have so they're excluded from
  my grocery list.

### Epic B — Meal Plan Generation
- **B1 (P0)** As a user, I get a breakfast, lunch, and dinner suggestion for the day.
  - *AC:* Three meals generated honoring dietary + servings constraints.
- **B2 (P0)** As a user, I can reroll/replace any single meal without changing the others.
- **B3 (P1)** As a user, I can lock a meal so rerolls don't change it.
- **B4 (P1)** As a user, I can manually pick a recipe from a library for any slot.
- **B5 (P2)** As a user, I can plan multiple days at once (week view).

### Epic C — Grocery List
- **C1 (P0)** As a user, I see a grocery list auto-generated from all three meals.
  - *AC:* Same ingredient across meals is merged with summed quantities.
- **C2 (P0)** As a user, the list is grouped by category (produce, dairy, pantry, …).
- **C3 (P1)** As a user, pantry items I own are excluded from the list.
- **C4 (P1)** As a user, I can check off items as I shop (todo behavior).
- **C5 (P2)** As a user, I can export/share the list (copy, print, or share link).

### Epic D — Substitutions
- **D1 (P0)** As a user, I can request a substitution for any ingredient and see
  alternatives with their cost delta.
- **D2 (P0)** As a user, substitutions respect my dietary restrictions.
  - *AC:* A dairy-free user is only offered dairy-free swaps.
- **D3 (P1)** As a user, when the plan is over budget, the app suggests money-saving swaps.
- **D4 (P2)** As a user, I can mark an ingredient as "don't have / unavailable" and get a
  recipe-safe replacement.

### Epic E — Budget Feasibility
- **E1 (P0)** As a user, I see the estimated total cost of the day's plan.
- **E2 (P0)** As a user, I see whether the plan is within my budget (clear pass/fail).
  - *AC:* Color-coded verdict: under / near (within 10%) / over.
- **E3 (P1)** As a user, when over budget, I see the overage amount and one-tap savings
  suggestions (swap recipes/ingredients) to get back under.
- **E4 (P2)** As a user, I see a per-meal cost breakdown.

### Epic F — Finalize & Track
- **F1 (P1)** As a user, I can finalize a day plan and turn the grocery list into a
  trackable todo list.
- **F2 (P1)** As a user, I can mark meals as cooked.
- **F3 (P2)** As a user, I can revisit past days to see what I planned and cooked.

---

## 4. Budget Feasibility Logic

```
planCost      = Σ (recipe ingredient cost, scaled to servings)  for B + L + D
pantryCredit  = Σ cost of ingredients already owned (excluded)
netCost       = planCost − pantryCredit
verdict:
   netCost ≤ budget                  → UNDER   (green)
   budget < netCost ≤ budget * 1.10  → NEAR    (amber)
   netCost > budget * 1.10           → OVER    (red)
overage       = max(0, netCost − budget)
```

When **OVER**, the savings engine ranks candidate actions by `costSaved / disruption`:
1. Ingredient substitutions (cheaper equivalent, dietary-safe) — lowest disruption.
2. Recipe swap for the most expensive meal slot.
3. Reduce optional/garnish ingredients.

Each suggestion shows: *"Swap X → Y, save $Z, still meets your diet."* Applying it
recomputes `netCost` live until the plan is back UNDER (or the user stops).

---

## 5. Substitution Logic (sketch)

A substitution candidate must satisfy: **(a)** dietary-compatible, **(b)** culinary-role
match (e.g. binder, fat, acid), and is then ranked by reason:
- **Cost** → cheapest compatible option (drives budget savings).
- **Availability** → "I don't have it" / out of stock → nearest pantry-friendly swap.
- **Preference/allergy** → exclude disliked or unsafe ingredients.

Data model: a substitution table keyed by ingredient → list of `{alt, role, dietaryTags,
unitCost}`. MVP can ship a curated static table; later this can be data-driven or
LLM-assisted.

---

## 6. Suggested MVP Scope (P0 only)

The smallest version that delivers the full promised flow end-to-end:

- Pick a day → set servings, budget, dietary tags.
- Generate B/L/D from a seeded recipe library; reroll individual meals.
- Auto grocery list (merged + categorized).
- Budget total + pass/near/over verdict.
- On-demand ingredient substitutions with cost delta, dietary-aware.

**Out of MVP:** pantry tracking, week view, savings auto-suggestions, sharing/export,
history, cooked tracking.

---

## 7. Proposed Tech Approach (for discussion)

- **Frontend:** React + TypeScript (Vite), component-driven. State via a single Day Plan
  store (Zustand/Context) so all four outputs derive from one source and recompute live.
- **Data:** Start with a local seeded JSON recipe + ingredient-cost + substitution dataset;
  no backend needed for MVP. Persist plans to `localStorage`.
- **Later:** Backend API for recipes/prices, user accounts, multi-day persistence.

> This section is a starting point — confirm the stack before we build.
