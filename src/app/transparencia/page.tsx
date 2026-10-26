import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import {
  InstitutionalDocuments,
  Partnerships,
  Summary,
} from "@/features/transparency/Transparency";
import { ListSkeleton, SummarySkeleton } from "@/features/transparency/TransparencySkeleton";
import { organizationLabel } from "@/lib/organization";
import { shareMetadata } from "../metadata";

export const metadata: Metadata = shareMetadata({
  title: "Transparência e prestação de contas",
  description:
    "Parcerias da Esportval com o poder público: valores, documentos e situação de cada prestação de contas (Lei 13.019/2014, art. 11).",
  path: "/transparencia",
});

const heading = "mb-6 font-display text-3xl font-extrabold uppercase sm:text-4xl";

export default function TransparencyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-[calc(var(--header-h)+3rem)] pb-20 sm:px-8">
      <Reveal on="mount" as="header" className="mb-10 max-w-3xl">
        <p className="mb-3 flex flex-wrap items-center gap-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-brand" />
          Prestação de contas
          {site.illustrativeContent && <Badge tone="warn">Dados de exemplo</Badge>}
        </p>
        <h1 className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase sm:text-7xl">
          Transparência
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Todas as parcerias da {site.name} com o poder público, com valores, equipe paga,
          documentos e a situação de cada prestação de contas, conforme o art. 11 da Lei 13.019/2014
          (Marco Regulatório das Organizações da Sociedade Civil).
        </p>
        <p className="mt-4 text-sm text-fg-subtle">
          {organizationLabel(site.organization, site.name)}
        </p>
        {site.illustrativeContent && (
          <p className="mt-4 rounded-xl bg-draw/10 p-4 text-sm text-draw ring-1 ring-draw/30">
            Os registros abaixo marcados como "Exemplo" mostram o formato da publicação e não são
            dados reais da associação.
          </p>
        )}
      </Reveal>

      <section aria-labelledby="resumo" className="mb-16">
        <h2 id="resumo" className="sr-only">
          Resumo
        </h2>
        <Suspense fallback={<SummarySkeleton />}>
          <Summary />
        </Suspense>
      </section>

      <section aria-labelledby="parcerias" className="mb-16">
        <h2 id="parcerias" className={heading}>
          Parcerias com o poder público
        </h2>
        <Suspense fallback={<ListSkeleton label="Carregando parcerias" />}>
          <Partnerships />
        </Suspense>
      </section>

      <section aria-labelledby="documentos" className="mb-16">
        <h2 id="documentos" className={heading}>
          Documentos institucionais
        </h2>
        <Suspense fallback={<ListSkeleton rows={4} label="Carregando documentos" />}>
          <InstitutionalDocuments />
        </Suspense>
      </section>

      <Reveal
        as="section"
        className="rounded-[var(--radius-card)] bg-ink-800 p-6 ring-1 ring-white/10 sm:p-8"
      >
        <h2 className="font-display text-2xl font-extrabold uppercase">
          Não encontrou o que procura?
        </h2>
        <p className="mt-2 text-fg-muted">
          Qualquer pessoa pode pedir informações sobre os recursos recebidos e os projetos
          executados.
        </p>
        <Link
          href="/#contato"
          className="mt-4 inline-block font-display text-xl font-bold tracking-wide text-brand uppercase underline-offset-4 hover:underline"
        >
          Solicitar informação
        </Link>
      </Reveal>
    </div>
  );
}
