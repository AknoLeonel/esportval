"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useMemo } from "react";
import { reveal, staggerDelay, viewport } from "@/lib/motion";

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
  // A preferência só entra em `custom` (transição); as variantes são sempre as mesmas, então o
  // HTML do servidor e o cliente concordam e nada fica preso no estado inicial.
  const custom = useMemo(
    () => ({ reduced: !!reduce, delay: staggerDelay(index) + delay }),
    [reduce, index, delay],
  );

  return (
    <Component
      className={className}
      variants={reveal}
      custom={custom}
      initial="hidden"
      {...(on === "view" ? { whileInView: "visible", viewport } : { animate: "visible" })}
    >
      {children}
    </Component>
  );
}
