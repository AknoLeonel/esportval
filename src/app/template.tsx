import type { ReactNode } from "react";
import { PageEnter } from "@/components/layout/PageEnter";

/** Remonta a cada navegação: dá a entrada suave de página. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
