import { describe, expect, it } from "vitest";
import { buildStandings } from "./standings";
import type { StandingInput } from "./types";

const row = (
  team: string,
  won: number,
  drawn: number,
  lost: number,
  gf: number,
  ga: number,
): StandingInput => ({
  team,
  played: won + drawn + lost,
  won,
  drawn,
  lost,
  goalsFor: gf,
  goalsAgainst: ga,
});

describe("buildStandings", () => {
  it("calcula pontos (3 por vitória, 1 por empate), saldo e aproveitamento", () => {
    const [first] = buildStandings([row("A", 3, 1, 1, 19, 8)]);
    expect(first).toMatchObject({ points: 10, goalDiff: 11, performance: 67, position: 1 });
  });

  it("ordena por pontos", () => {
    const table = buildStandings([row("A", 1, 0, 4, 5, 9), row("B", 4, 0, 1, 9, 3)]);
    expect(table.map((r) => r.team)).toEqual(["B", "A"]);
  });

  it("desempata por vitórias, depois saldo, depois gols pró, depois nome", () => {
    // todos com 7 pontos
    const byWins = buildStandings([row("Z", 1, 4, 0, 5, 5), row("Y", 2, 1, 2, 5, 5)]);
    expect(byWins.map((r) => r.team)).toEqual(["Y", "Z"]);

    const byGoalDiff = buildStandings([row("A", 2, 1, 2, 5, 6), row("B", 2, 1, 2, 8, 6)]);
    expect(byGoalDiff.map((r) => r.team)).toEqual(["B", "A"]);

    const byGoalsFor = buildStandings([row("A", 2, 1, 2, 6, 5), row("B", 2, 1, 2, 9, 8)]);
    expect(byGoalsFor.map((r) => r.team)).toEqual(["B", "A"]);

    const byName = buildStandings([row("Beta", 2, 1, 2, 5, 5), row("Alfa", 2, 1, 2, 5, 5)]);
    expect(byName.map((r) => r.team)).toEqual(["Alfa", "Beta"]);
  });

  it("numera as posições a partir de 1", () => {
    const table = buildStandings([row("A", 0, 0, 1, 0, 1), row("B", 1, 0, 0, 1, 0)]);
    expect(table.map((r) => r.position)).toEqual([1, 2]);
  });

  it("aproveitamento é 0 sem jogos", () => {
    expect(buildStandings([row("A", 0, 0, 0, 0, 0)])[0]?.performance).toBe(0);
  });

  it("preserva a marcação da nossa equipe", () => {
    const table = buildStandings([{ ...row("Esportval", 1, 0, 0, 2, 0), isUs: true }]);
    expect(table[0]?.isUs).toBe(true);
  });

  it("não altera a entrada", () => {
    const input = [row("A", 0, 0, 1, 0, 1), row("B", 1, 0, 0, 1, 0)];
    buildStandings(input);
    expect(input.map((r) => r.team)).toEqual(["A", "B"]);
  });
});
