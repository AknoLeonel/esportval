"use client";

import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { page } from "@/lib/motion";

let hydrated = false;

/**
 * Entrada suave a cada navegação. No primeiro carregamento NÃO anima: o HTML do servidor já chega
 * visível (bom para LCP e para quem está sem JavaScript).
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const [initial] = useState<"hidden" | false>(() => (hydrated ? "hidden" : false));

  useEffect(() => {
    hydrated = true;
  }, []);

  return (
    <motion.div variants={page} initial={initial} animate="visible">
      {children}
    </motion.div>
  );
}
