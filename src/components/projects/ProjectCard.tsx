import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { LazyImage } from "@/components/ui/LazyImage";
import { formatPeriod } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/lib/projects";
import type { Project } from "@/lib/types";

/** Card de projeto com link para a página do projeto. */
export function ProjectCard({
  project,
  showIllustrative,
}: {
  project: Project;
  showIllustrative: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-ink-800 ring-1 ring-white/10 transition-[box-shadow,background-color] duration-200 hover:bg-ink-700 hover:ring-brand/40">
      <LazyImage
        src={project.cover.src}
        alt={project.cover.alt}
        width={1200}
        height={800}
        unoptimized
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        wrapperClassName="aspect-[3/2]"
        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={project.status === "em-andamento" ? "brand" : "ok"}>
            {PROJECT_STATUS_LABEL[project.status]}
          </Badge>
          {project.modalities.map((modality) => (
            <Badge key={modality}>{modality}</Badge>
          ))}
          {showIllustrative && project.illustrative && <Badge tone="warn">Exemplo</Badge>}
        </div>
        <h3 className="font-display text-3xl leading-[1.05] font-extrabold uppercase">
          <Link
            href={`/projetos/${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-fg-muted">{project.summary}</p>
        <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm text-fg-subtle">
          <span>{formatPeriod(project.period)}</span>
          {project.beneficiaries !== undefined && (
            <span>{project.beneficiaries.toLocaleString("pt-BR")} pessoas atendidas</span>
          )}
        </p>
      </div>
      {/* foco visível do link que cobre o card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] ring-brand-300 group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}
