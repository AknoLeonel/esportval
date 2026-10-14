"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { reveal, revealReduced, staggerDelay, viewport } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Posição na lista: gera o atraso em cascata (limitado). */
  index?: number;
  /** Atraso extra em segundos. */
  delay?: number;
  /** `view` anima ao entrar na tela; `mount` anima assim que monta (hero, conteúdo trocado). */
  on?: "view" | "mount";
  as?: "div" | "section" | "li" | "article" | "header" | "p" | "h1" | "h2" | "span";
};

/** Entrada suave padrão do site: opacity + translateY + blur. */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  on = "view",
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const variants = reduce ? revealReduced : reveal;
  const stagger = staggerDelay(index) + delay;

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      {...(on === "view" ? { whileInView: "visible", viewport } : { animate: "visible" })}
      transition={stagger ? { delay: stagger } : undefined}
    >
      {children}
    </Component>
  );
}
