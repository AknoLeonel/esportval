import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Selo "conteúdo ilustrativo" enquanto os dados reais não foram cadastrados. */
  illustrative?: boolean;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  illustrative,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal as="header" className="mb-10 max-w-2xl sm:mb-14">
          <p className="mb-3 flex items-center gap-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            {eyebrow}
            {illustrative && (
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.7rem] tracking-widest text-fg-subtle ring-1 ring-white/10">
                Conteúdo ilustrativo
              </span>
            )}
          </p>
          <h2
            id={`${id}-title`}
            className="font-display text-4xl leading-none font-extrabold tracking-tight uppercase sm:text-6xl"
          >
            {title}
          </h2>
          {description && <p className="mt-4 text-lg text-fg-muted">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
