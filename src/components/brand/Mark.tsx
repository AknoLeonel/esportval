import Image from "next/image";
import { cn } from "@/lib/cn";

/** Proporção do vetor original (manual de identidade visual Esportval 2027). */
const ESCUDO = { src: "/marca/escudo.svg", width: 778, height: 660 } as const;

/**
 * Escudo oficial da Esportval: bola com futebol, beisebol, golfe e basquete atravessada pela faixa
 * "E-SPORT'VAL". O SVG em `public/marca/escudo.svg` foi extraído do manual; não redesenhe aqui.
 * Sem `title` a imagem é decorativa (o texto ao lado já nomeia a associação).
 */
export function Mark({
  className,
  title,
  eager = false,
}: {
  className?: string;
  title?: string;
  eager?: boolean;
}) {
  return (
    <Image
      src={ESCUDO.src}
      width={ESCUDO.width}
      height={ESCUDO.height}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      loading={eager ? "eager" : "lazy"}
      unoptimized
      draggable={false}
      className={cn("object-contain select-none", className)}
    />
  );
}
