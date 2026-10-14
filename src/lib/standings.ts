import type { StandingInput } from "./types";

export type StandingRow = StandingInput & {
  position: number;
  points: number;
  goalDiff: number;
  /** Aproveitamento: pontos conquistados / pontos disputados, 0–100. */
  performance: number;
};

const POINTS_PER_WIN = 3;
const POINTS_PER_DRAW = 1;

/** Classificação: pontos, vitórias, saldo de gols, gols pró, nome. */
export function buildStandings(rows: StandingInput[]): StandingRow[] {
  return rows
    .map((row) => {
      const points = row.won * POINTS_PER_WIN + row.drawn * POINTS_PER_DRAW;
      return {
        ...row,
        points,
        goalDiff: row.goalsFor - row.goalsAgainst,
        performance:
          row.played > 0 ? Math.round((points / (row.played * POINTS_PER_WIN)) * 100) : 0,
        position: 0,
      };
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.won - a.won ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor ||
        a.team.localeCompare(b.team, "pt-BR"),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}
