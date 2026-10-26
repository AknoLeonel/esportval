import type { Match } from "@/lib/types";

const LEAGUE = "Liga Regional · 1ª divisão";

/** Dados ilustrativos. Substitua pela agenda real (ou por uma chamada à API/CMS do clube). */
const matches: Match[] = [
  {
    id: "j10",
    date: "2026-11-07T20:00:00-03:00",
    competition: LEAGUE,
    opponent: "Jatobá Futsal",
    home: false,
    venue: "Ginásio Jatobá",
    status: "scheduled",
  },
  {
    id: "j09",
    date: "2026-10-31T19:00:00-03:00",
    competition: LEAGUE,
    opponent: "Pequi Futsal",
    home: true,
    venue: "Ginásio Esportval",
    status: "scheduled",
  },
  {
    id: "j08",
    date: "2026-10-24T20:00:00-03:00",
    competition: LEAGUE,
    opponent: "Buriti Futsal",
    home: false,
    venue: "Arena Buriti",
    status: "scheduled",
  },
  {
    id: "j07",
    date: "2026-10-17T19:30:00-03:00",
    competition: LEAGUE,
    opponent: "Ipê Futsal",
    home: true,
    venue: "Ginásio Esportval",
    status: "scheduled",
  },
  {
    id: "j06",
    date: "2026-10-10T19:30:00-03:00",
    competition: LEAGUE,
    opponent: "Candeia Futsal",
    home: true,
    venue: "Ginásio Esportval",
    status: "finished",
    score: { for: 5, against: 2 },
  },
  {
    id: "j05",
    date: "2026-10-03T20:00:00-03:00",
    competition: LEAGUE,
    opponent: "Sucupira Futsal",
    home: false,
    venue: "Quadra Sucupira",
    status: "finished",
    score: { for: 3, against: 3 },
  },
  {
    id: "j04",
    date: "2026-09-26T19:30:00-03:00",
    competition: LEAGUE,
    opponent: "Cerrado Futsal",
    home: true,
    venue: "Ginásio Esportval",
    status: "finished",
    score: { for: 4, against: 1 },
  },
  {
    id: "j03",
    date: "2026-09-19T20:00:00-03:00",
    competition: LEAGUE,
    opponent: "Ipê Futsal",
    home: false,
    venue: "Ginásio Ipê",
    status: "finished",
    score: { for: 1, against: 2 },
  },
  {
    id: "j02",
    date: "2026-09-12T19:30:00-03:00",
    competition: LEAGUE,
    opponent: "Buriti Futsal",
    home: true,
    venue: "Ginásio Esportval",
    status: "finished",
    score: { for: 6, against: 0 },
  },
];

/** Simula a camada de dados assíncrona (CMS/API): o site já nasce preparado para streaming + skeleton. */
export async function getMatches(): Promise<Match[]> {
  return matches;
}
