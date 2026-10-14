"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { spring } from "@/lib/motion";

/** Respeita prefers-reduced-motion em todo o site (remove transform/layout, mantém opacidade). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring.enter}>
      {children}
    </MotionConfig>
  );
}
