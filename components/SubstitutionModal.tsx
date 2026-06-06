"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Chip } from "@/components/ui/Chip";
import { usePlanStore } from "@/store/planStore";
import { getSubstitutions } from "@/lib/substitutions";
import { money } from "@/lib/format";
import type { MealSlot, RecipeIngredient } from "@/lib/types";

interface SubstitutionModalProps {
  open: boolean;
  onClose: () => void;
  slot: MealSlot;
  ingredient: RecipeIngredient | null;
}

export function SubstitutionModal({
  open,
  onClose,
  slot,
  ingredient,
}: SubstitutionModalProps) {
  const dietaryTags = usePlanStore((s) => s.constraints.dietaryTags);
  const applySubstitution = usePlanStore((s) => s.applySubstitution);

  const options = useMemo(() => {
    if (!ingredient) return [];
    return getSubstitutions(ingredient.name, ingredient.cost, dietaryTags);
  }, [ingredient, dietaryTags]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ingredient ? `Swap ${ingredient.name}` : "Swap ingredient"}
    >
      {options.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <span aria-hidden className="text-3xl">
            🍽️
          </span>
          <p className="font-display text-base font-semibold text-charcoal">
            No swaps available
          </p>
          <p className="text-sm text-muted">
            We couldn&apos;t find a good substitute for this ingredient that fits
            your preferences.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {options.map((option) => {
            const cheaper = option.costDelta < 0;
            const pricier = option.costDelta > 0;
            const deltaLabel = cheaper
              ? `save ${money(Math.abs(option.costDelta))}`
              : pricier
                ? `+${money(option.costDelta)}`
                : "same price";
            return (
              <li key={option.name}>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  onClick={() => {
                    if (!ingredient) return;
                    applySubstitution(slot, ingredient.name, option);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-shell px-4 py-3 text-left transition-colors hover:border-terracotta/50 hover:bg-surface"
                >
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="truncate font-medium capitalize text-charcoal">
                      {option.name}
                    </span>
                    {option.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {option.dietaryTags.map((tag) => (
                          <Chip key={tag} as="span">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    className={[
                      "shrink-0 text-sm font-semibold tabular-nums",
                      cheaper
                        ? "text-herb"
                        : pricier
                          ? "text-tomato"
                          : "text-muted",
                    ].join(" ")}
                  >
                    {deltaLabel}
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
