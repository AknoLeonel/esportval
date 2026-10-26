import type { Match } from "./types";

export type MatchResult = "V" | "E" | "D";

const TIME_ZONE = "America/Sao_Paulo";

/** Resultado do ponto de vista da nossa equipe. */
export function matchResult(score: { for: number; against: number }): MatchResult {
  if (score.for > score.against) return "V";
  if (score.for < score.against) return "D";
  return "E";
}

export type MatchDateParts = { weekday: string; day: string; month: string; time: string };

/** Data em pt-BR, sempre no fuso de Brasília (evita diferença entre servidor e navegador). */
export function formatMatchDate(iso: string): MatchDateParts {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    (parts.find((part) => part.type === type)?.value ?? "").replace(".", "");
  return {
    weekday: get("weekday"),
    day: get("day"),
    month: get("month"),
    time: `${get("hour")}:${get("minute")}`,
  };
}

/** "1 de novembro de 2026" a partir de yyyy-mm-dd. */
export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function splitMatches(matches: Match[]): { upcoming: Match[]; results: Match[] } {
  const byDate = (a: Match, b: Match) => Date.parse(a.date) - Date.parse(b.date);
  return {
    upcoming: matches.filter((m) => m.status === "scheduled").sort(byDate),
    results: matches.filter((m) => m.status === "finished").sort((a, b) => byDate(b, a)),
  };
}

export type TeamSummary = {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
};

export function summarize(matches: Match[]): TeamSummary {
  const summary: TeamSummary = {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };
  for (const match of matches) {
    if (match.status !== "finished" || !match.score) continue;
    summary.played += 1;
    summary.goalsFor += match.score.for;
    summary.goalsAgainst += match.score.against;
    const result = matchResult(match.score);
    if (result === "V") summary.won += 1;
    else if (result === "E") summary.drawn += 1;
    else summary.lost += 1;
  }
  return summary;
}
