"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

/** Número que "sobe" até o valor ao entrar na tela. O HTML do servidor já traz o valor final. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: duration.slow * 2,
      ease: ease.out,
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
