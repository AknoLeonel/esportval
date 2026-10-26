import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Match } from "@/lib/types";
import { MatchCard } from "./MatchCard";
import { MatchesTabs } from "./MatchesTabs";

const upcoming: Match = {
  id: "u1",
  date: "2026-10-17T19:30:00-03:00",
  competition: "Liga",
  opponent: "Ipê Futsal",
  home: true,
  venue: "Ginásio Esportval",
  status: "scheduled",
};
const win: Match = {
  id: "r1",
  date: "2026-10-10T19:30:00-03:00",
  competition: "Liga",
  opponent: "Candeia Futsal",
  home: false,
  venue: "Quadra Candeia",
  status: "finished",
  score: { for: 5, against: 2 },
};

describe("MatchCard", () => {
  it("mostra o horário e destaca o mandante em jogos agendados", () => {
    render(<MatchCard match={upcoming} />);
    expect(screen.getByText("19:30")).toBeInTheDocument();
    expect(screen.getByLabelText("Esportval contra Ipê Futsal")).toBeInTheDocument();
  });

  it("mostra o placar na ordem mandante–visitante e o resultado por texto (não só cor)", () => {
    render(<MatchCard match={win} />);
    // jogamos fora: o placar exibido é adversário–nós
    expect(screen.getByLabelText("2 a 5")).toBeInTheDocument();
    expect(screen.getByText("Vitória")).toBeInTheDocument();
  });
});

describe("MatchesTabs", () => {
  it("começa nos próximos jogos e troca para resultados", async () => {
    const user = userEvent.setup();
    render(<MatchesTabs upcoming={[upcoming]} results={[win]} />);

    expect(screen.getByRole("tab", { name: "Próximos jogos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Ginásio Esportval · Liga")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Resultados" }));

    expect(await screen.findByText("Vitória")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("navega entre abas com as setas do teclado", async () => {
    const user = userEvent.setup();
    render(<MatchesTabs upcoming={[upcoming]} results={[win]} />);

    screen.getByRole("tab", { name: "Próximos jogos" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("mostra mensagem quando não há jogos", () => {
    render(<MatchesTabs upcoming={[]} results={[]} />);
    expect(screen.getByText("Nenhum jogo agendado por enquanto.")).toBeInTheDocument();
  });
});
