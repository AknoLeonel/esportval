import Link from "next/link";
import { Gallery } from "@/components/media/Gallery";
import { Badge } from "@/components/ui/Badge";
import { LazyImage } from "@/components/ui/LazyImage";
import { Reveal } from "@/components/ui/Reveal";
import { formatPeriod } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/lib/projects";
import type { Partnership, Project } from "@/lib/types";

type Props = { project: Project; partnership?: Partnership; showIllustrative: boolean };

export function ProjectDetail({ project, partnership, showIllustrative }: Props) {
  const facts = [
    { label: "Período", value: formatPeriod(project.period) },
    { label: "Local", value: project.location },
    { label: "Público", value: project.audience },
    ...(project.beneficiaries !== undefined
      ? [{ label: "Pessoas atendidas", value: project.beneficiaries.toLocaleString("pt-BR") }]
      : []),
    ...(project.funding ? [{ label: "Financiamento", value: project.funding }] : []),
  ];

  return (
    <article className="mx-auto w-full max-w-6xl px-5 pt-[calc(var(--header-h)+2.5rem)] pb-20 sm:px-8">
      <nav aria-label="Trilha" className="mb-6 text-sm text-fg-subtle">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-fg">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
          </li>
          <li>
            <Link href="/projetos" className="hover:text-fg">
              Projetos
            </Link>
            <span aria-hidden="true"> / </span>
          </li>
          <li aria-current="page" className="text-fg-muted">
            {project.title}
          </li>
        </ol>
      </nav>

      <Reveal on="mount" as="header" className="max-w-3xl">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone={project.status === "em-andamento" ? "brand" : "ok"}>
            {PROJECT_STATUS_LABEL[project.status]}
          </Badge>
          {project.modalities.map((modality) => (
            <Badge key={modality}>{modality}</Badge>
          ))}
          {showIllustrative && project.illustrative && <Badge tone="warn">Exemplo</Badge>}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-extrabold uppercase">
          {project.title}
        </h1>
        <p className="mt-4 text-xl text-fg-muted">{project.summary}</p>
      </Reveal>

      <Reveal on="mount" index={1} className="mt-10">
        <LazyImage
          src={project.cover.src}
          alt={project.cover.alt}
          width={1200}
          height={800}
          unoptimized
          eager
          sizes="(min-width: 1152px) 1152px, 100vw"
          wrapperClassName="aspect-[3/2] max-h-[32rem] w-full rounded-[var(--radius-card)] ring-1 ring-white/10 sm:aspect-[21/9]"
          className="size-full object-cover"
        />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <Reveal className="space-y-4 text-lg text-fg-muted">
            {project.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          {project.results.length > 0 && (
            <Reveal>
              <h2 className="mb-4 font-display text-3xl font-extrabold uppercase">Resultados</h2>
              <ul className="grid gap-2">
                {project.results.map((result) => (
                  <li
                    key={result}
                    className="flex gap-3 rounded-xl bg-ink-800 px-4 py-3 ring-1 ring-white/10"
                  >
                    <span aria-hidden="true" className="text-brand">
                      ●
                    </span>
                    {result}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {project.gallery.length > 0 && (
            <Reveal>
              <h2 className="mb-4 font-display text-3xl font-extrabold uppercase">Galeria</h2>
              <Gallery items={project.gallery} />
            </Reveal>
          )}
        </div>

        <Reveal as="div" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <aside
            aria-label="Ficha do projeto"
            className="rounded-[var(--radius-card)] bg-ink-800 p-6 ring-1 ring-white/10"
          >
            <h2 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
              Ficha do projeto
            </h2>
            <dl className="grid gap-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-fg-subtle">{fact.label}</dt>
                  <dd className="text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {partnership && (
              <Link
                href={`/transparencia#${partnership.id}`}
                className="mt-6 block rounded-2xl bg-brand/10 p-4 ring-1 ring-brand/30 transition-colors duration-150 hover:bg-brand/15"
              >
                <span className="block text-sm text-fg-subtle">Prestação de contas</span>
                <span className="font-display text-xl font-bold uppercase">
                  {partnership.instrument}
                </span>
                <span className="mt-1 block text-sm text-brand-300">
                  Ver valores e documentos →
                </span>
              </Link>
            )}
          </aside>
        </Reveal>
      </div>
    </article>
  );
}
