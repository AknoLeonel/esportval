import { cn } from "@/lib/cn";
import { Crest } from "./Crest";

/** Escudo + wordmark. Usado no header e no rodapé. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Crest className="size-11 shrink-0 drop-shadow-[0_4px_16px_rgb(255_106_19/0.35)]" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-2xl font-extrabold tracking-wide uppercase">
            Esportval
          </span>
          <span className="block pt-0.5 font-display text-xs font-semibold tracking-[0.32em] text-brand uppercase">
            Futsal
          </span>
        </span>
      )}
    </span>
  );
}
