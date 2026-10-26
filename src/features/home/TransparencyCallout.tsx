import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";
import { site } from "@/data/site";
import { getPartnerships } from "@/data/transparency";
import { formatBRL } from "@/lib/format";
import { summarizePartnerships } from "@/lib/transparency";

export async function TransparencyNumbers() {
  const summary = summarizePartnerships(await getPartnerships());
  const items = [
    { label: "Recursos pactuados", value: formatBRL(summary.total) },
    { label: "Recursos recebidos", value: formatBRL(summary.released) },
    { label: "Prestações de contas aprovadas", value: `${summary.approved} de ${summary.count}` },
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          key={item.label}
          index={index}
          className="flex flex-col-reverse rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10"
        >
          <dt className="mt-1 text-sm text-fg-muted">{item.label}</dt>
          <dd className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
            {item.value}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

export function TransparencyCallout() {
  return (
    <Section
      id="transparencia"
      eyebrow="Prestação de contas"
      title="Transparência"
      description="Publicamos todas as parcerias com o poder público, com valores, documentos e a situação de cada prestação de contas, como manda a Lei 13.019/2014 (art. 11)."
      illustrative={site.illustrativeContent}
      className="bg-ink-900"
    >
      <Suspense
        fallback={
          <SkeletonRegion label="Carregando resumo da transparência">
            <div className="grid gap-3 sm:grid-cols-3">
              {["a", "b", "c"].map((key) => (
                <Skeleton key={key} className="h-28 rounded-2xl" />
              ))}
            </div>
          </SkeletonRegion>
        }
      >
        <TransparencyNumbers />
      </Suspense>
      <Reveal className="mt-10">
        <ButtonLink href="/transparencia">Ver parcerias e documentos</ButtonLink>
      </Reveal>
    </Section>
  );
}
