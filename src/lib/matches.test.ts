import { describe, expect, it } from "vitest";
import { formatLongDate, formatMatchDate, matchResult, splitMatches, summarize } from "./matches";
import type { Match } from "./types";

const base = { competition: "Liga", venue: "Ginásio", home: true };
const finished = (id: string, date: string, f: number, a: number): Match => ({
  ...base,
  id,
  date,
  opponent: "X",
  status: "finished",
  score: { for: f, against: a },
});
const scheduled = (id: string, date: string): Match => ({
  ...base,
  id,
  date,
  opponent: "Y",
  status: "scheduled",
});

describe("matchResult", () => {
  it.each([
    [{ for: 3, against: 1 }, "V"],
    [{ for: 1, against: 3 }, "D"],
    [{ for: 2, against: 2 }, "E"],
    [{ for: 0, against: 0 }, "E"],
  ] as const)("%j → %s", (score, expected) => {
    expect(matchResult(score)).toBe(expected);
  });
});

describe("formatMatchDate", () => {
  it("usa o fuso de Brasília e hora em 24h", () => {
    expect(formatMatchDate("2026-10-17T19:30:00-03:00")).toEqual({
      weekday: "sáb",
      day: "17",
      month: "out",
      time: "19:30",
    });
  });

  it("converte instantes UTC para o horário de Brasília", () => {
    expect(formatMatchDate("2026-10-18T02:30:00Z").time).toBe("23:30");
    expect(formatMatchDate("2026-10-18T02:30:00Z").day).toBe("17");
  });

  it("mostra meia-noite como 00:00", () => {
    expect(formatMatchDate("2026-10-17T00:05:00-03:00").time).toBe("00:05");
  });
});

describe("formatLongDate", () => {
  it("formata por extenso em pt-BR sem deslocar o dia", () => {
    expect(formatLongDate("2026-10-01")).toBe("1 de outubro de 2026");
    expect(formatLongDate("2026-12-31")).toBe("31 de dezembro de 2026");
  });
});

describe("splitMatches", () => {
  const list = [
    scheduled("s2", "2026-11-07T20:00:00-03:00"),
    finished("f1", "2026-09-12T19:30:00-03:00", 6, 0),
    scheduled("s1", "2026-10-17T19:30:00-03:00"),
    finished("f2", "2026-10-10T19:30:00-03:00", 5, 2),
  ];

  it("ordena próximos do mais próximo ao mais distante", () => {
    expect(splitMatches(list).upcoming.map((m) => m.id)).toEqual(["s1", "s2"]);
  });

  it("ordena resultados do mais recente ao mais antigo", () => {
    expect(splitMatches(list).results.map((m) => m.id)).toEqual(["f2", "f1"]);
  });

  it("não altera a lista original", () => {
    const copy = [...list];
    splitMatches(list);
    expect(list).toEqual(copy);
  });
});

describe("summarize", () => {
  it("soma jogos, resultados e gols apenas de partidas finalizadas", () => {
    const result = summarize([
      finished("a", "2026-09-01T10:00:00-03:00", 5, 2),
      finished("b", "2026-09-02T10:00:00-03:00", 3, 3),
      finished("c", "2026-09-03T10:00:00-03:00", 1, 2),
      scheduled("d", "2026-10-01T10:00:00-03:00"),
    ]);
    expect(result).toEqual({ played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 9, goalsAgainst: 7 });
  });

  it("ignora partida finalizada sem placar", () => {
    const broken: Match = { ...scheduled("x", "2026-09-01T10:00:00-03:00"), status: "finished" };
    expect(summarize([broken]).played).toBe(0);
  });

  it("zera tudo sem jogos", () => {
    expect(summarize([])).toEqual({
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    });
  });
});
