import type { StandingInput } from "@/lib/types";

/** Dados ilustrativos de classificação (a pontuação é calculada em lib/standings). */
const standings: StandingInput[] = [
  { team: "Cerrado Futsal", played: 5, won: 4, drawn: 0, lost: 1, goalsFor: 15, goalsAgainst: 7 },
  {
    team: "Esportval",
    played: 5,
    won: 3,
    drawn: 1,
    lost: 1,
    goalsFor: 19,
    goalsAgainst: 8,
    isUs: true,
  },
  { team: "Ipê Futsal", played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 13, goalsAgainst: 9 },
  { team: "Buriti Futsal", played: 5, won: 2, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 9 },
  { team: "Sucupira Futsal", played: 5, won: 2, drawn: 1, lost: 2, goalsFor: 11, goalsAgainst: 12 },
  { team: "Candeia Futsal", played: 5, won: 1, drawn: 2, lost: 2, goalsFor: 8, goalsAgainst: 12 },
  { team: "Pequi Futsal", played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 7, goalsAgainst: 13 },
  { team: "Jatobá Futsal", played: 5, won: 0, drawn: 1, lost: 4, goalsFor: 5, goalsAgainst: 17 },
];

export async function getStandings(): Promise<StandingInput[]> {
  return standings;
}
