import { describe, expect, it } from "vitest";
import {
  addDays,
  formatBRL,
  formatDate,
  formatLongDate,
  formatMonthYear,
  formatPeriod,
  normalizeText,
} from "./format";

describe("formatBRL", () => {
  it("formata em reais com separadores brasileiros e espaço comum", () => {
    expect(formatBRL(120000)).toBe("R$ 120.000,00");
    expect(formatBRL(1234.5)).toBe("R$ 1.234,50");
    expect(formatBRL(0)).toBe("R$ 0,00");
  });
});

describe("datas", () => {
  it("dd/mm/aaaa sem deslocar o dia por fuso", () => {
    expect(formatDate("2025-03-01")).toBe("01/03/2025");
    expect(formatDate("2025-12-31")).toBe("31/12/2025");
  });

  it("por extenso", () => {
    expect(formatLongDate("2026-10-01")).toBe("1 de outubro de 2026");
  });

  it("mês/ano curto", () => {
    expect(formatMonthYear("2025-03")).toBe("mar/2025");
    expect(formatMonthYear("2025-12")).toBe("dez/2025");
  });

  it("período com e sem fim", () => {
    expect(formatPeriod({ start: "2025-03", end: "2025-12" })).toBe("mar/2025 – dez/2025");
    expect(formatPeriod({ start: "2026-02" })).toBe("desde fev/2026");
    expect(formatPeriod({ start: "2025-07", end: "2025-07" })).toBe("jul/2025");
  });

  it("soma dias atravessando mês e ano", () => {
    expect(addDays("2025-12-20", 180)).toBe("2026-06-18");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2025-01-10", 0)).toBe("2025-01-10");
  });
});

describe("normalizeText", () => {
  it("ignora acentos, maiúsculas e espaços nas pontas", () => {
    expect(normalizeText("  Secretaria de ESPORTE e Lazer ")).toBe("secretaria de esporte e lazer");
    expect(normalizeText("Vôlei Ação")).toBe("volei acao");
  });
});
