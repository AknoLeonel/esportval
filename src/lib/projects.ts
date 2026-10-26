import type { Modality, Project, ProjectStatus } from "./types";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "em-andamento": "Em andamento",
  concluido: "Concluído",
};

/** Em andamento primeiro; dentro de cada grupo, os mais recentes primeiro. */
export function sortProjects(projects: Project[]): Project[] {
  const rank = (p: Project) => (p.status === "em-andamento" ? 0 : 1);
  return [...projects].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      b.period.start.localeCompare(a.period.start) ||
      a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function modalitiesOf(projects: Project[]): Modality[] {
  return [...new Set(projects.flatMap((p) => p.modalities))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export type ProjectFilter = { modality?: Modality | "todas"; status?: ProjectStatus | "todos" };

export function filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
  return projects.filter(
    (p) =>
      (!filter.modality || filter.modality === "todas" || p.modalities.includes(filter.modality)) &&
      (!filter.status || filter.status === "todos" || p.status === filter.status),
  );
}

export type ProjectStats = {
  projects: number;
  completed: number;
  beneficiaries: number;
  modalities: number;
};

export function projectStats(projects: Project[]): ProjectStats {
  return {
    projects: projects.length,
    completed: projects.filter((p) => p.status === "concluido").length,
    beneficiaries: projects.reduce((sum, p) => sum + (p.beneficiaries ?? 0), 0),
    modalities: modalitiesOf(projects).length,
  };
}

export function findProject(projects: Project[], slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
