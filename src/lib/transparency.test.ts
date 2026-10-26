import { describe, expect, it } from "vitest";
import {
  ACCOUNTABILITY,
  disclosureUntil,
  filterPartnerships,
  memberTotal,
  partnershipYears,
  releasedPercent,
  sortPartnerships,
  summarizePartnerships,
  teamTotal,
} from "./transparency";
import type { AccountabilityStatus, Partnership } from "./types";

const partnership = (
  id: string,
  signedAt: string,
  status: AccountabilityStatus,
  patch: Partial<Partnership> = {},
): Partnership => ({
  id,
  instrument: `Termo de Fomento ${id}`,
  agency: "Secretaria de Esporte e Lazer",
  signedAt,
  object: "Aulas de vôlei",
  totalValue: 100000,
  releasedValue: 50000,
  accountability: { status },
  team: [],
  documents: [],
  ...patch,
});

const list = [
  partnership("p1", "2024-05-10", "aprovada", { totalValue: 80000, releasedValue: 80000 }),
  partnership("p2", "2025-02-01", "em-execucao", {
    object: "Escolinha de Futsal",
    agency: "Administração Regional",
  }),
  partnership("p3", "2025-08-20", "aprovada-com-ressalvas"),
];

describe("summarizePartnerships", () => {
  it("soma valores e conta aprovadas (com ou sem ressalvas)", () => {
    expect(summarizePartnerships(list)).toEqual({
      count: 3,
      total: 280000,
      released: 180000,
      approved: 2,
    });
  });

  it("zera sem parcerias", () => {
    expect(summarizePartnerships([])).toEqual({ count: 0, total: 0, released: 0, approved: 0 });
  });
});

describe("filterPartnerships", () => {
  it("filtra por ano de assinatura", () => {
    expect(filterPartnerships(list, { year: 2025 }).map((p) => p.id)).toEqual(["p2", "p3"]);
  });

  it("filtra por situação", () => {
    expect(filterPartnerships(list, { status: "aprovada" }).map((p) => p.id)).toEqual(["p1"]);
  });

  it("busca em instrumento, órgão e objeto sem diferenciar acentos", () => {
    expect(filterPartnerships(list, { query: "FUTSAL" }).map((p) => p.id)).toEqual(["p2"]);
    expect(filterPartnerships(list, { query: "administracao" }).map((p) => p.id)).toEqual(["p2"]);
    expect(filterPartnerships(list, { query: "volei" }).map((p) => p.id)).toEqual(["p1", "p3"]);
    expect(filterPartnerships(list, { query: "fomento p3" }).map((p) => p.id)).toEqual(["p3"]);
  });

  it("'todos'/'todas' e busca vazia não filtram", () => {
    expect(filterPartnerships(list, { year: "todos", status: "todas", query: "  " })).toHaveLength(
      3,
    );
  });

  it("combina filtros", () => {
    expect(
      filterPartnerships(list, { year: 2025, status: "em-execucao", query: "futsal" }),
    ).toHaveLength(1);
    expect(filterPartnerships(list, { year: 2024, query: "futsal" })).toHaveLength(0);
  });
});

describe("anos e ordenação", () => {
  it("anos únicos do mais recente ao mais antigo", () => {
    expect(partnershipYears(list)).toEqual([2025, 2024]);
  });

  it("parcerias mais recentes primeiro, sem alterar a entrada", () => {
    expect(sortPartnerships(list).map((p) => p.id)).toEqual(["p3", "p2", "p1"]);
    expect(list.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("desempata pelo id", () => {
    const same = [
      partnership("b", "2025-01-01", "aprovada"),
      partnership("a", "2025-01-01", "aprovada"),
    ];
    expect(sortPartnerships(same).map((p) => p.id)).toEqual(["a", "b"]);
  });
});

describe("valores", () => {
  it("percentual liberado arredondado e limitado a 100", () => {
    expect(releasedPercent(list[1] as Partnership)).toBe(50);
    expect(
      releasedPercent(partnership("x", "2025-01-01", "aprovada", { releasedValue: 120000 })),
    ).toBe(100);
    expect(releasedPercent(partnership("x", "2025-01-01", "aprovada", { totalValue: 0 }))).toBe(0);
    expect(
      releasedPercent(partnership("x", "2025-01-01", "aprovada", { releasedValue: 33333 })),
    ).toBe(33);
  });

  it("remuneração total da equipe = soma de salário mensal × meses (art. 11, VI)", () => {
    expect(
      teamTotal([
        { role: "Coordenador", monthlyPay: 3000, months: 10 },
        { role: "Professor", monthlyPay: 2000.5, months: 2 },
      ]),
    ).toBe(34001);
    expect(teamTotal([])).toBe(0);
  });

  it("função com várias pessoas multiplica pelo número de pessoas", () => {
    const monitors = { role: "Monitores", monthlyPay: 1800, months: 1, people: 8 };
    expect(memberTotal(monitors)).toBe(14400);
    expect(memberTotal({ role: "Coordenação", monthlyPay: 3500, months: 3 })).toBe(10500);
    expect(teamTotal([monitors, { role: "Coordenação", monthlyPay: 3500, months: 3 }])).toBe(24900);
  });
});

describe("disclosureUntil (Decreto 8.726/2016)", () => {
  it("180 dias após a apresentação da prestação de contas final", () => {
    const p = partnership("x", "2025-01-01", "em-analise", {
      accountability: { status: "em-analise", submittedAt: "2025-12-20" },
    });
    expect(disclosureUntil(p)).toBe("2026-06-18");
  });

  it("sem apresentação ainda, não há data final", () => {
    expect(disclosureUntil(list[1] as Partnership)).toBeNull();
  });
});

describe("ACCOUNTABILITY", () => {
  it("toda situação tem rótulo e descrição", () => {
    for (const meta of Object.values(ACCOUNTABILITY)) {
      expect(meta.label).toBeTruthy();
      expect(meta.description).toBeTruthy();
    }
    expect(ACCOUNTABILITY.rejeitada.tone).toBe("bad");
    expect(ACCOUNTABILITY.aprovada.tone).toBe("ok");
  });
});
