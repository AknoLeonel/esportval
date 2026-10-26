import { cn } from "@/lib/cn";
import { Mark } from "./Mark";

/** Marca + wordmark. Usado no header e no rodapé. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark className="size-11 shrink-0" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-2xl font-extrabold tracking-wide uppercase">
            Esportval
          </span>
          <span className="block pt-0.5 font-display text-[0.7rem] font-semibold tracking-[0.3em] text-brand uppercase">
            Projetos esportivos
          </span>
        </span>
      )}
    </span>
  );
}
