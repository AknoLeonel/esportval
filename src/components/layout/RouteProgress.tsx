"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { duration, ease, routeProgress } from "@/lib/motion";
import { startsRouteChange } from "@/lib/navigation";

type Phase = "idle" | "loading" | "done";

/** Barra no topo enquanto a próxima página carrega: acende no clique, completa quando a rota muda. */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [phase, setPhase] = useState<Phase>("idle");
  const route = `${pathname ?? ""}?${search?.toString() ?? ""}`;
  const lastRoute = useRef(route);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const internal = startsRouteChange(
        {
          href: anchor.href,
          target: anchor.getAttribute("target"),
          hasDownload: anchor.hasAttribute("download"),
        },
        event,
        window.location.href,
      );
      if (internal) setPhase("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (route === lastRoute.current) return;
    lastRoute.current = route;
    setPhase((current) => (current === "loading" ? "done" : current));
  }, [route]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="route-progress"
          aria-hidden="true"
          data-testid="route-progress"
          data-phase={phase}
          className="fixed inset-x-0 top-0 z-[61] h-[3px] origin-left bg-brand-300 shadow-[0_0_12px_rgb(255_160_102/0.7)] will-change-transform"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={
            phase === "loading"
              ? {
                  scaleX: routeProgress.trickleTo,
                  transition: { duration: routeProgress.trickleDuration, ease: ease.out },
                }
              : { scaleX: 1, transition: { duration: duration.fast, ease: ease.out } }
          }
          exit={{ opacity: 0, transition: { duration: duration.base } }}
          onAnimationComplete={() => {
            if (phase === "done") setPhase("idle");
          }}
        />
      )}
    </AnimatePresence>
  );
}
