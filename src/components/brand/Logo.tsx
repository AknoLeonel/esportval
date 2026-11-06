import Image from "next/image";
import { cn } from "@/lib/cn";
import { Mark } from "./Mark";

/** Versão só com o texto, sobre a faixa preta (página 5 do manual): funciona sobre qualquer fundo. */
const WORDMARK = { src: "/marca/esportval.svg", width: 978, height: 165 } as const;

/**
 * Escudo + wordmark oficial. Usado no header e no rodapé; `compact` mostra só o escudo.
 * `eager` carrega sem lazy: só no header, que está acima da dobra.
 */
export function Logo({
  className,
  compact = false,
  eager = false,
}: {
  className?: string;
  compact?: boolean;
  eager?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark className="size-12 shrink-0" eager={eager} />
      {!compact && (
        <Image
          src={WORDMARK.src}
          width={WORDMARK.width}
          height={WORDMARK.height}
          alt="Esportval"
          loading={eager ? "eager" : "lazy"}
          unoptimized
          draggable={false}
          className="h-7 w-auto select-none"
        />
      )}
    </span>
  );
}
