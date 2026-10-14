"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { duration, ease, viewport } from "@/lib/motion";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  label: string;
  className?: string;
  /** Texto lido por leitores de tela (padrão: "<label>: <value>%"). */
  valueText?: string;
};

/** Progresso determinado: o preenchimento cresce (scaleX) ao entrar na tela. */
export function ProgressBar({ value, label, className, valueText }: ProgressBarProps) {
  const reduce = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={valueText ?? `${label}: ${Math.round(clamped)}%`}
      className={cn("h-1.5 overflow-hidden rounded-full bg-ink-600", className)}
    >
      <motion.div
        className="h-full origin-left rounded-full bg-brand will-change-transform"
        style={{ width: `${clamped}%` }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: duration.slow, ease: ease.out }}
      />
    </div>
  );
}
