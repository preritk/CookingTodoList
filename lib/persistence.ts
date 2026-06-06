import { Constraints, DayPlan } from "@/lib/types";

const CONSTRAINTS_KEY = "ctl:constraints";

function planKey(date: string): string {
  return `ctl:plan:${date}`;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Persist a day plan to localStorage (no-op during SSR). */
export function saveDayPlan(plan: DayPlan): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(planKey(plan.date), JSON.stringify(plan));
  } catch {
    // Ignore write failures (e.g. quota / disabled storage).
  }
}

/** Load a saved day plan by date, or null if missing/unparseable/SSR. */
export function loadDayPlan(date: string): DayPlan | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(planKey(date));
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as DayPlan;
  } catch {
    return null;
  }
}

/** Persist constraints to localStorage (no-op during SSR). */
export function saveConstraints(c: Constraints): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CONSTRAINTS_KEY, JSON.stringify(c));
  } catch {
    // Ignore write failures.
  }
}

/** Load saved constraints, or null if missing/unparseable/SSR. */
export function loadConstraints(): Constraints | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(CONSTRAINTS_KEY);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as Constraints;
  } catch {
    return null;
  }
}
