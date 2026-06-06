"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

/** Numeric +/- stepper used for servings and similar quantities. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label,
  className,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </span>
      )}
      <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
        <StepButton onClick={() => onChange(clamp(value - step))} disabled={value <= min}>
          −
        </StepButton>
        <motion.span
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className="w-9 text-center text-base font-semibold tabular-nums"
        >
          {value}
        </motion.span>
        <StepButton onClick={() => onChange(clamp(value + step))} disabled={value >= max}>
          +
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full text-lg leading-none",
        "text-charcoal hover:bg-shell disabled:opacity-30 disabled:hover:bg-transparent",
      )}
    >
      {children}
    </motion.button>
  );
}
