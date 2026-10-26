import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Partnership, Project } from "@/lib/types";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectsExplorer } from "./ProjectsExplorer";

const media = (id: string) => ({
  id,
  src: `/projetos/${id}.svg`,
  alt: `Imagem ${id}`,
  caption: `Legenda ${id}`,
});
const project = (patch: Partial<Project> & Pick<Project, "slug" | "title">): Project => ({
  summary: `Resumo ${patch.slug}`,
  description: ["Primeiro parágrafo."],
  modalities: ["Futsal"],
  status: "concluido",
  period: { start: "2025-01", end: "2025-06" },
  location: "Ginásio",
  audience: "Jovens",
  beneficiaries: 50,
  results: ["Resultado A"],
  cover: media(`${patch.slug}-1`),
  gallery: [],
  ...patch,
});

const projects = [
  project({
    slug: "futsal",
    title: "Futsal",
    status: "em-andamento",
    period: { start: "2026-01" },
  }),
  project({ slug: "volei", title: "Vôlei", modalities: ["Vôlei"], illustrative: true }),
  project({ slug: "festival", title: "Festival", modalities: ["Multiesportes", "Futsal"] }),
];

describe("ProjectsExplorer", () => {
  it("lista todos os projetos com link para a página de cada um", () => {
    render(<ProjectsExplorer projects={projects} showIllustrative />);
    expect(screen.getByText("3 projetos encontrados")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vôlei" })).toHaveAttribute("href", "/projetos/volei");
  });

  it("mostra o selo Exemplo só quando pedido", () => {
    const { rerender } = render(<ProjectsExplorer projects={projects} showIllustrative />);
    expect(screen.getAllByText("Exemplo")).toHaveLength(1);
    rerender(<ProjectsExplorer projects={projects} showIllustrative={false} />);
    expect(screen.queryByText("Exemplo")).toBeNull();
  });

  it("filtra por modalidade e por situação", async () => {
    const user = userEvent.setup();
    render(<ProjectsExplorer projects={projects} showIllustrative={false} />);

    await user.click(screen.getByRole("button", { name: "Futsal" }));
    expect(screen.getByRole("button", { name: "Futsal" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 projetos encontrados")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("link", { name: "Vôlei" })).toBeNull());

    await user.click(screen.getByRole("button", { name: "Em andamento" }));
    expect(screen.getByText("1 projeto encontrado")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Concluído" }));
    await user.click(screen.getByRole("button", { name: "Vôlei" }));
    expect(screen.getByText("1 projeto encontrado")).toBeInTheDocument();
  });

  it("mostra estado vazio quando nada combina", async () => {
    const user = userEvent.setup();
    render(<ProjectsExplorer projects={projects} showIllustrative={false} />);
    await user.click(screen.getByRole("button", { name: "Vôlei" }));
    await user.click(screen.getByRole("button", { name: "Em andamento" }));
    expect(screen.getByText("Nenhum projeto com esses filtros.")).toBeInTheDocument();
  });
});

describe("ProjectDetail", () => {
  const partnership = { id: "p-1", instrument: "Termo de Fomento nº 1/2025" } as Partnership;

  it("mostra ficha, resultados, trilha e o link para a prestação de contas", () => {
    render(
      <ProjectDetail
        project={project({
          slug: "volei",
          title: "Vôlei",
          funding: "Termo de fomento",
          illustrative: true,
        })}
        partnership={partnership}
        showIllustrative
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Vôlei" })).toBeInTheDocument();
    const facts = screen.getByRole("complementary", { name: "Ficha do projeto" });
    expect(within(facts).getByText("jan/2025 – jun/2025")).toBeInTheDocument();
    expect(within(facts).getByText("Termo de fomento")).toBeInTheDocument();
    expect(
      within(facts).getByRole("link", { name: /Termo de Fomento nº 1\/2025/ }),
    ).toHaveAttribute("href", "/transparencia#p-1");
    expect(screen.getByText("Resultado A")).toBeInTheDocument();
    expect(screen.getByText("Exemplo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Trilha" })).toHaveTextContent("Projetos");
  });

  it("sem parceria, beneficiados, resultados ou galeria, esconde esses blocos", () => {
    render(
      <ProjectDetail
        project={project({ slug: "x", title: "X", beneficiaries: undefined, results: [] })}
        showIllustrative={false}
      />,
    );
    expect(screen.queryByText("Pessoas atendidas")).toBeNull();
    expect(screen.queryByText("Resultados")).toBeNull();
    expect(screen.queryByText("Galeria")).toBeNull();
    expect(screen.queryByText("Prestação de contas")).toBeNull();
  });

  it("mostra a galeria quando houver imagens", () => {
    render(
      <ProjectDetail
        project={project({ slug: "g", title: "G", gallery: [media("g-2")] })}
        showIllustrative={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Ampliar: Legenda g-2" })).toBeInTheDocument();
  });
});
