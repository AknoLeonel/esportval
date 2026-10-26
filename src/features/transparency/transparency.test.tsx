import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { Partnership } from "@/lib/types";
import { PartnershipsExplorer } from "./PartnershipsExplorer";
import { InstitutionalDocuments, Summary } from "./Transparency";

const base: Partnership = {
  id: "p-2025-01",
  instrument: "Termo de Fomento nº 12/2025",
  agency: "Secretaria de Esporte",
  signedAt: "2025-05-12",
  object: "Festival de futsal",
  totalValue: 85000,
  releasedValue: 42500,
  validUntil: "2025-08-31",
  accountability: {
    status: "em-analise",
    dueAt: "2025-09-30",
    submittedAt: "2025-09-22",
    analysisDeadline: "2026-03-21",
  },
  team: [{ role: "Coordenação", monthlyPay: 3500, months: 3 }],
  documents: [
    { title: "Plano de trabalho", href: "/documentos/plano.pdf", publishedAt: "2025-05-20" },
    { title: "Relatório final" },
  ],
  projectSlug: "festival",
  illustrative: true,
};
const older: Partnership = {
  ...base,
  id: "p-2024-01",
  instrument: "Termo de Colaboração nº 3/2024",
  signedAt: "2024-07-15",
  object: "Aulas de vôlei",
  accountability: { status: "aprovada", result: "Aprovadas sem ressalvas." },
  team: [],
  documents: [],
  illustrative: false,
};

const renderExplorer = (list: Partnership[] = [base, older]) =>
  render(
    <PartnershipsExplorer
      partnerships={list}
      organization="Esportval — CNPJ em atualização"
      showIllustrative
    />,
  );

afterEach(() => {
  window.location.hash = "";
});

describe("PartnershipsExplorer", () => {
  it("lista as parcerias da mais recente para a mais antiga, com situação e valor", () => {
    renderExplorer();
    const buttons = screen.getAllByRole("button", { expanded: false });
    expect(buttons[0]).toHaveTextContent("Termo de Fomento nº 12/2025");
    expect(buttons[0]).toHaveTextContent("Em análise");
    expect(buttons[0]).toHaveTextContent("R$ 85.000,00");
    expect(buttons[1]).toHaveTextContent("Aprovada");
    expect(screen.getAllByText("Exemplo")).toHaveLength(1);
  });

  it("abre os detalhes com TODOS os campos do art. 11", async () => {
    const user = userEvent.setup();
    renderExplorer();
    await user.click(screen.getByRole("button", { name: /Termo de Fomento nº 12\/2025/ }));
    const panel = await screen.findByRole("region", {
      name: "Detalhes: Termo de Fomento nº 12/2025",
    });

    // I, II, III, IV
    expect(within(panel).getByText("Secretaria de Esporte")).toBeInTheDocument();
    expect(within(panel).getByText("12/05/2025")).toBeInTheDocument();
    expect(within(panel).getByText("Esportval — CNPJ em atualização")).toBeInTheDocument();
    expect(within(panel).getByText("Festival de futsal", { selector: "dd" })).toBeInTheDocument();
    expect(within(panel).getByText("R$ 42.500,00")).toBeInTheDocument();
    expect(within(panel).getByRole("progressbar", { name: "Percentual liberado" })).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
    // V
    expect(within(panel).getByText("22/09/2025")).toBeInTheDocument();
    expect(within(panel).getByText("21/03/2026")).toBeInTheDocument();
    expect(within(panel).getByText(/Divulgação obrigatória até 21\/03\/2026/)).toBeInTheDocument();
    // VI
    expect(within(panel).getByText("Coordenação")).toBeInTheDocument();
    expect(within(panel).getAllByText("R$ 10.500,00")).toHaveLength(2); // linha + total
    // documentos
    expect(within(panel).getByRole("link", { name: /Plano de trabalho/ })).toHaveAttribute(
      "href",
      "/documentos/plano.pdf",
    );
    expect(within(panel).getByText("Em publicação")).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /Ver o projeto executado/ })).toHaveAttribute(
      "href",
      "/projetos/festival",
    );

    await user.click(screen.getByRole("button", { name: /Termo de Fomento nº 12\/2025/ }));
    await waitFor(() => expect(screen.queryByRole("region", { name: /Detalhes/ })).toBeNull());
  });

  it("parceria sem equipe paga e sem prestação apresentada", async () => {
    const user = userEvent.setup();
    renderExplorer([{ ...older, accountability: { status: "em-execucao" } }]);
    await user.click(screen.getByRole("button", { name: /Termo de Colaboração/ }));
    const panel = await screen.findByRole("region", { name: /Detalhes/ });
    expect(
      within(panel).getByText("Nenhuma remuneração de equipe com recursos desta parceria."),
    ).toBeInTheDocument();
    expect(within(panel).getByText(/até 180 dias após a apresentação/)).toBeInTheDocument();
  });

  it("filtra por busca, ano e situação", async () => {
    const user = userEvent.setup();
    renderExplorer();

    await user.type(screen.getByRole("searchbox"), "volei");
    expect(screen.getByText("1 parceria")).toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox"));

    await user.selectOptions(screen.getByLabelText("Ano"), "2025");
    expect(screen.getByText("1 parceria")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Ano"), "todos");

    await user.selectOptions(screen.getByLabelText("Situação das contas"), "rejeitada");
    expect(screen.getByText("Nenhuma parceria com esses filtros.")).toBeInTheDocument();
  });

  it("abre a parceria indicada no endereço (#id)", async () => {
    window.location.hash = "#p-2024-01";
    Element.prototype.scrollIntoView = () => {};
    renderExplorer();
    expect(
      await screen.findByRole("region", { name: "Detalhes: Termo de Colaboração nº 3/2024" }),
    ).toBeInTheDocument();
  });

  it("sem parcerias, explica que serão publicadas desde a assinatura", () => {
    renderExplorer([]);
    expect(
      screen.getByText(/Nenhuma parceria com o poder público até o momento/),
    ).toBeInTheDocument();
  });
});

describe("seções da transparência (Server Components)", () => {
  it("resumo soma os valores dos dados publicados", async () => {
    render(await Summary());
    expect(screen.getByText("Parcerias publicadas").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Valor total pactuado").nextSibling).toHaveTextContent("R$ 193.000,00");
  });

  it("documentos institucionais sem arquivo aparecem como 'em publicação'", async () => {
    render(await InstitutionalDocuments());
    expect(screen.getByRole("heading", { name: "Estatuto social" })).toBeInTheDocument();
    expect(screen.getAllByText("Em publicação").length).toBeGreaterThanOrEqual(6);
  });
});
