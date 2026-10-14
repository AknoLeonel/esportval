import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GalleryContent } from "./gallery/GallerySection";
import { HeroPanel } from "./hero/Hero";
import { MatchesContent } from "./matches/MatchesSection";
import { NewsList } from "./news/NewsSection";
import { SquadContent } from "./squad/SquadSection";
import { StandingsTable } from "./standings/StandingsSection";

/** Server Components assíncronos: resolvemos o JSX no teste e renderizamos o resultado. */
describe("seções (dados ilustrativos)", () => {
  it("classificação: ordenada, com a nossa equipe marcada e progresso acessível", async () => {
    render(await StandingsTable());
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(8);
    expect(within(rows[0] as HTMLElement).getByText("Cerrado Futsal")).toBeInTheDocument();
    const us = screen.getByRole("row", { current: true });
    expect(within(us).getByText("Esportval")).toBeInTheDocument();
    expect(within(us).getByText("+11")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")).toHaveLength(8);
  });

  it("notícias: datas por extenso em pt-BR", async () => {
    render(await NewsList());
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("11 de outubro de 2026")).toBeInTheDocument();
  });

  it("hero: próximo jogo e números da temporada vêm dos resultados", async () => {
    render(await HeroPanel());
    expect(screen.getByLabelText("Próximo jogo")).toHaveTextContent("Esportval × Ipê Futsal");
    expect(screen.getByText("Gols marcados").nextSibling).toHaveTextContent("19");
    expect(screen.getByText("Aproveitamento").nextSibling).toHaveTextContent("67%");
  });

  it("jogos: abre em próximos jogos", async () => {
    render(await MatchesContent());
    expect(screen.getByRole("tab", { name: "Próximos jogos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("elenco: 12 atletas e comissão técnica", async () => {
    render(await SquadContent());
    expect(screen.getByText("12 atletas exibidos")).toBeInTheDocument();
    expect(screen.getByText("Comissão técnica")).toBeInTheDocument();
  });

  it("galeria: 6 imagens com texto alternativo", async () => {
    render(await GalleryContent());
    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(6);
    for (const image of images) expect(image).toHaveAttribute("alt");
  });
});
