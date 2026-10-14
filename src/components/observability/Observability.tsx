"use client";

import { useEffect } from "react";
import { initClientObservability } from "@/lib/observability/client";

/** Liga os provedores do navegador depois da hidratação, sem bloquear a renderização. */
export function Observability() {
  useEffect(() => {
    initClientObservability();
  }, []);
  return null;
}
