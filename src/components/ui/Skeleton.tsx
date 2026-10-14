import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Bloco de carregamento. Decorativo: o aviso para leitores de tela fica no `SkeletonRegion`. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** Região de carregamento anunciada uma única vez aos leitores de tela. */
export function SkeletonRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
