import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "info" | "warn" | "ok" | "bad" | "brand";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-white/5 text-fg-muted ring-white/15",
  info: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
  warn: "bg-draw/10 text-draw ring-draw/30",
  ok: "bg-win/10 text-win ring-win/30",
  bad: "bg-loss/10 text-loss ring-loss/30",
  brand: "bg-brand/15 text-brand-300 ring-brand/30",
};

/** Selo de status. O texto sempre carrega o significado (cor nunca sozinha). */
export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-display text-xs font-bold tracking-widest whitespace-nowrap uppercase ring-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
