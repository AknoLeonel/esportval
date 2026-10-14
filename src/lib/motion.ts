import type { Transition, Variants } from "motion/react";

/**
 * Tokens de motion — única fonte de durações, easings e springs.
 * Baseado na skill design-motion-principles (Jakub principal, Jhey secundária, Emil em forms/nav).
 */
type Bezier = [number, number, number, number];

export const duration = {
  /** Interações de alta frequência (filtros, teclado). */
  instant: 0.12,
  /** Hover, saídas, micro-feedback (Emil: ≤ 180ms). */
  fast: 0.18,
  base: 0.28,
  /** Entrada padrão (Jakub: 200–500ms). */
  enter: 0.45,
  slow: 0.7,
} as const;

export const ease: Record<"out" | "inOut" | "sheet", Bezier> = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  /** Curva de sheets do iOS (Vaul). */
  sheet: [0.32, 0.72, 0, 1],
};

export const spring = {
  /** Produção: desacelera sem overshoot. */
  enter: { type: "spring", duration: duration.enter, bounce: 0 },
  /** Momentos de destaque (hero, placar). */
  soft: { type: "spring", duration: 0.55, bounce: 0.1 },
  press: { type: "spring", duration: duration.fast, bounce: 0 },
} as const satisfies Record<string, Transition>;

const exitTransition: Transition = { duration: duration.fast, ease: ease.out };

/** Entrada: opacity + translateY + blur. Saída: mais curta e mais sutil que a entrada. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring.enter },
  exit: { opacity: 0, y: -4, filter: "blur(2px)", transition: exitTransition },
};

/** Movimento reduzido: só opacidade, sem deslocamento nem blur. */
export const revealReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.instant } },
};

/** Painéis e menus: nascem perto da origem, nunca de scale(0). */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: ease.out } },
};

export const STAGGER_STEP = 0.05;
export const MAX_STAGGER_ITEMS = 8;

/** Atraso de entrada por índice, limitado para listas longas não demorarem a aparecer. */
export function staggerDelay(index: number, step: number = STAGGER_STEP): number {
  const clamped = Math.min(Math.max(index, 0), MAX_STAGGER_ITEMS);
  return Math.round(clamped * step * 1000) / 1000;
}

/** Dispara uma vez, um pouco antes do elemento ficar totalmente visível. */
export const viewport = { once: true, amount: 0.2, margin: "0px 0px -60px 0px" } as const;
