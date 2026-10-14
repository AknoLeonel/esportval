"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Barra de progresso de leitura da página, no topo. Só transform. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-progress"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand will-change-transform"
    />
  );
}
