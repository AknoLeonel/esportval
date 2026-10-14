"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

/** Número que "sobe" até o valor ao entrar na tela. O HTML do servidor já traz o valor final. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(value);
  // O texto é um MotionValue: o Motion atualiza o nó sem brigar com o React (nada de textContent).
  const text = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!inView || reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, [0, value], { duration: duration.slow * 2, ease: ease.out });
    return () => controls.stop();
  }, [inView, reduce, value, count]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {text}
    </motion.span>
  );
}
