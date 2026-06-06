"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SubstitutionModal } from "@/components/SubstitutionModal";
import { usePlanStore } from "@/store/planStore";
import { money, slotIcon, slotLabel } from "@/lib/format";
import type { Meal, RecipeIngredient } from "@/lib/types";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { slot, recipe } = meal;
  const servings = usePlanStore((s) => s.constraints.servings);
  const reroll = usePlanStore((s) => s.reroll);

  const [swapTarget, setSwapTarget] = useState<RecipeIngredient | null>(null);

  const scale = useMemo(
    () => (recipe.baseServings > 0 ? servings / recipe.baseServings : 1),
    [servings, recipe.baseServings],
  );

  const mealCost = useMemo(
    () => recipe.ingredients.reduce((sum, ing) => sum + ing.cost * scale, 0),
    [recipe.ingredients, scale],
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card interactive className="flex h-full flex-col overflow-hidden">
          {/* Photo + slot badge */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-charcoal/40 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-charcoal shadow-[var(--shadow-soft)] backdrop-blur">
              <span aria-hidden>{slotIcon(slot)}</span>
              {slotLabel(slot)}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5">
            {/* Title + meta */}
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-xl font-semibold leading-tight text-charcoal">
                {recipe.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                  <span aria-hidden>⏱️</span>
                  {recipe.prepTimeMin} min
                </span>
                {recipe.dietaryTags.map((tag) => (
                  <Chip key={tag} as="span">
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <ul className="flex flex-1 flex-col divide-y divide-line">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="group flex items-center justify-between gap-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm capitalize text-charcoal">
                    {ing.name}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted">
                    {+(ing.qty * scale).toFixed(2)} {ing.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSwapTarget(ing)}
                    aria-label={`Swap ${ing.name}`}
                    className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-shell hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta"
                  >
                    ⇄ swap
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer: cost + reroll */}
            <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
              <div className="flex flex-col leading-tight">
                <span className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">
                  Meal cost
                </span>
                <span className="font-display text-lg font-semibold text-charcoal tabular-nums">
                  {money(mealCost)}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => reroll(slot)}
              >
                <span aria-hidden>🎲</span>
                Reroll
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <SubstitutionModal
        open={swapTarget !== null}
        onClose={() => setSwapTarget(null)}
        slot={slot}
        ingredient={swapTarget}
      />
    </>
  );
}
