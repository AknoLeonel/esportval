"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { cn } from "@/lib/cn";
import { duration, ease, filterItem } from "@/lib/motion";
import { filterProjects, modalitiesOf, PROJECT_STATUS_LABEL, sortProjects } from "@/lib/projects";
import type { Modality, Project, ProjectStatus } from "@/lib/types";

const chip =
  "rounded-full px-4 py-2 font-display text-base font-bold tracking-wide uppercase ring-1 transition-[background-color,color,transform] duration-150 active:scale-[0.97]";
const chipOn = "bg-brand text-ink-950 ring-brand";
const chipOff = "bg-ink-800 text-fg-muted ring-white/10 hover:text-fg";

const STATUSES: ("todos" | ProjectStatus)[] = ["todos", "em-andamento", "concluido"];

export function ProjectsExplorer({
  projects,
  showIllustrative,
}: {
  projects: Project[];
  showIllustrative: boolean;
}) {
  const [modality, setModality] = useState<Modality | "todas">("todas");
  const [status, setStatus] = useState<ProjectStatus | "todos">("todos");
  const modalities = useMemo(() => modalitiesOf(projects), [projects]);
  const visible = useMemo(
    () => sortProjects(filterProjects(projects, { modality, status })),
    [projects, modality, status],
  );

  return (
    <div>
      <div className="mb-8 grid gap-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 w-full text-sm text-fg-subtle">Modalidade</legend>
          {(["todas", ...modalities] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={modality === item}
              onClick={() => setModality(item)}
              className={cn(chip, modality === item ? chipOn : chipOff)}
            >
              {item === "todas" ? "Todas" : item}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 w-full text-sm text-fg-subtle">Situação</legend>
          {STATUSES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={status === item}
              onClick={() => setStatus(item)}
              className={cn(chip, status === item ? chipOn : chipOff)}
            >
              {item === "todos" ? "Todos" : PROJECT_STATUS_LABEL[item]}
            </button>
          ))}
        </fieldset>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? "1 projeto encontrado" : `${visible.length} projetos encontrados`}
      </p>

      {visible.length === 0 && (
        <p className="mb-4 text-fg-muted">Nenhum projeto com esses filtros.</p>
      )}

      {/* A lista fica sempre montada: os cards saem e voltam com animação ao mexer nos filtros. */}
      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              variants={filterItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ layout: { duration: duration.base, ease: ease.out } }}
            >
              <ProjectCard project={project} showIllustrative={showIllustrative} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
