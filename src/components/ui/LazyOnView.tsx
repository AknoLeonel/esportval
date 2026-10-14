"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type LazyOnViewProps = {
  /** Exibido até o bloco chegar perto da tela (skeleton). */
  fallback: ReactNode;
  children: ReactNode;
  /** Distância antes da tela em que o bloco passa a montar. */
  rootMargin?: string;
  className?: string;
};

/**
 * Adia a montagem de blocos pesados (galeria, formulário) até estarem perto da viewport.
 * O skeleton ocupa o mesmo espaço, então não há salto de layout.
 */
export function LazyOnView({
  fallback,
  children,
  rootMargin = "320px",
  className,
}: LazyOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || ready) return;
    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {ready ? (
        <Reveal on="mount" delay={0.05}>
          {children}
        </Reveal>
      ) : (
        fallback
      )}
    </div>
  );
}
