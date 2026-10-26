import { describe, expect, it } from "vitest";
import { filterProjects, findProject, modalitiesOf, projectStats, sortProjects } from "./projects";
import type { Project } from "./types";

const media = { id: "m", src: "/x.svg", alt: "x", caption: "x" };
const project = (patch: Partial<Project> & Pick<Project, "slug">): Project => ({
  title: patch.slug,
  summary: "",
  description: [],
  modalities: ["Futsal"],
  status: "concluido",
  period: { start: "2025-01" },
  location: "",
  audience: "",
  results: [],
  cover: media,
  gallery: [],
  ...patch,
});

const list = [
  project({ slug: "a", status: "concluido", period: { start: "2024-03" }, beneficiaries: 100 }),
  project({
    slug: "b",
    status: "em-andamento",
    period: { start: "2025-02" },
    modalities: ["Vôlei"],
  }),
  project({
    slug: "c",
    status: "concluido",
    period: { start: "2025-06" },
    modalities: ["Futsal", "Basquete"],
    beneficiaries: 40,
  }),
];

describe("sortProjects", () => {
  it("em andamento primeiro, depois do mais recente ao mais antigo", () => {
    expect(sortProjects(list).map((p) => p.slug)).toEqual(["b", "c", "a"]);
  });

  it("desempata pelo título", () => {
    const tie = [project({ slug: "z", title: "Zeta" }), project({ slug: "y", title: "Alfa" })];
    expect(sortProjects(tie).map((p) => p.slug)).toEqual(["y", "z"]);
  });

  it("não altera a lista original", () => {
    const before = list.map((p) => p.slug);
    sortProjects(list);
    expect(list.map((p) => p.slug)).toEqual(before);
  });
});

describe("filterProjects", () => {
  it("filtra por modalidade (projeto com várias modalidades entra em cada uma)", () => {
    expect(filterProjects(list, { modality: "Futsal" }).map((p) => p.slug)).toEqual(["a", "c"]);
    expect(filterProjects(list, { modality: "Basquete" }).map((p) => p.slug)).toEqual(["c"]);
  });

  it("filtra por situação", () => {
    expect(filterProjects(list, { status: "em-andamento" }).map((p) => p.slug)).toEqual(["b"]);
  });

  it("combina filtros e aceita 'todas'/'todos'", () => {
    expect(filterProjects(list, { modality: "Futsal", status: "concluido" })).toHaveLength(2);
    expect(filterProjects(list, { modality: "todas", status: "todos" })).toHaveLength(3);
    expect(filterProjects(list, {})).toHaveLength(3);
  });
});

describe("projectStats", () => {
  it("conta projetos, concluídos, beneficiados (sem dado = 0) e modalidades distintas", () => {
    expect(projectStats(list)).toEqual({
      projects: 3,
      completed: 2,
      beneficiaries: 140,
      modalities: 3,
    });
  });

  it("zera sem projetos", () => {
    expect(projectStats([])).toEqual({
      projects: 0,
      completed: 0,
      beneficiaries: 0,
      modalities: 0,
    });
  });
});

describe("modalitiesOf / findProject", () => {
  it("modalidades únicas em ordem alfabética", () => {
    expect(modalitiesOf(list)).toEqual(["Basquete", "Futsal", "Vôlei"]);
  });

  it("encontra pelo slug", () => {
    expect(findProject(list, "b")?.slug).toBe("b");
    expect(findProject(list, "nao-existe")).toBeUndefined();
  });
});
