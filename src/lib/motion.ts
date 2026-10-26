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

/** Parâmetros dinâmicos das variantes de entrada (passados via `custom`). */
export type RevealCustom = {
  /** Usuário pediu movimento reduzido: só a opacidade anima, o resto vai direto ao estado final. */
  reduced?: boolean;
  /** Atraso (segundos) para a cascata em listas. */
  delay?: number;
};

/**
 * Com movimento reduzido o deslocamento e o blur saltam para o estado final (duração 0) e só a
 * opacidade faz fade. Importante: as CHAVES animadas são as mesmas com ou sem a preferência. O servidor
 * não conhece a preferência e já grava `blur(4px)`/`translateY(8px)` no HTML; se o cliente animasse
 * só `opacity`, esses valores nunca seriam limpos (site borrado para quem reduz movimento).
 */
const reducedTransition: Transition = {
  opacity: { duration: duration.fast },
  y: { duration: 0 },
  filter: { duration: 0 },
};

/** Entrada: opacity + translateY + blur. Saída: mais curta e mais sutil que a entrada. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: (custom?: RevealCustom) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    // O `transition` da variante vence o da prop do componente, por isso o atraso mora aqui.
    transition: custom?.reduced
      ? reducedTransition
      : { ...spring.enter, delay: custom?.delay ?? 0 },
    // transitionEnd remove o filter: `blur(0px)` residual cria um bloco de contenção que quebra
    // `position: fixed` nos descendentes (lightbox) e mantém camadas de GPU à toa.
    transitionEnd: { filter: "none" },
  }),
  exit: { opacity: 0, y: -4, filter: "blur(2px)", transition: exitTransition },
};

/**
 * Entrada de página na navegação (template.tsx). Sem blur: é um bloco grande, e o blur custaria caro.
 * Mesmas chaves em todos os estados, então nada fica preso com movimento reduzido.
 */
export const page: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

/**
 * Itens de listas filtráveis (projetos, parcerias). Filtro e busca são interações frequentes
 * (Emil): rápido, sem blur e sem deslocamento. Mesmas chaves em todos os estados.
 */
export const filterItem: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: duration.fast, ease: ease.out } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.instant, ease: ease.out } },
};

/** Barra de progresso entre páginas: avança devagar até 85% e completa quando a rota muda. */
export const routeProgress = {
  trickleTo: 0.85,
  trickleDuration: 2.4,
} as const;

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
