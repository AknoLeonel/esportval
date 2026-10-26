import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "./About";
import { FeaturedList } from "./FeaturedProjects";
import { Impact } from "./Hero";
import { TransparencyNumbers } from "./TransparencyCallout";

describe("home (dados de exemplo)", () => {
  it("números de impacto vêm dos projetos e das parcerias", async () => {
    render(await Impact());
    expect(screen.getByText("Projetos realizados").nextSibling).toHaveTextContent("4");
    expect(screen.getByText("Pessoas atendidas").nextSibling).toHaveTextContent("560");
    expect(screen.getByText("Parcerias publicadas").nextSibling).toHaveTextContent("3");
    expect(
      screen.getByText("Números calculados a partir dos projetos de exemplo."),
    ).toBeInTheDocument();
  });

  it("destaca 3 projetos, em andamento primeiro", async () => {
    render(await FeaturedList());
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/projetos/corrida-e-saude");
  });

  it("resumo da transparência em reais", async () => {
    render(await TransparencyNumbers());
    expect(screen.getByText("Recursos pactuados").nextSibling).toHaveTextContent("R$ 193.000,00");
    expect(screen.getByText("Prestações de contas aprovadas").nextSibling).toHaveTextContent(
      "1 de 3",
    );
  });

  it("quem somos traz o lema e os valores", () => {
    render(<About />);
    expect(screen.getByRole("region", { name: "A Esportval" })).toBeInTheDocument();
    expect(screen.getByText("Contas abertas")).toBeInTheDocument();
  });
});
