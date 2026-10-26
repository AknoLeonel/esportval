import { addDays, normalizeText } from "./format";
import type { AccountabilityStatus, Partnership, TeamMember } from "./types";

type Tone = "neutral" | "info" | "warn" | "ok" | "bad";

/** Rótulos da situação da prestação de contas, em linguagem de cidadão. */
export const ACCOUNTABILITY: Record<
  AccountabilityStatus,
  { label: string; tone: Tone; description: string }
> = {
  "em-execucao": {
    label: "Em execução",
    tone: "info",
    description: "Parceria vigente; a prestação de contas final ainda não é devida.",
  },
  "a-apresentar": {
    label: "A apresentar",
    tone: "warn",
    description: "Execução encerrada; prestação de contas dentro do prazo de apresentação.",
  },
  "em-analise": {
    label: "Em análise",
    tone: "info",
    description: "Prestação de contas apresentada e em análise pelo órgão.",
  },
  aprovada: { label: "Aprovada", tone: "ok", description: "Contas aprovadas pelo órgão." },
  "aprovada-com-ressalvas": {
    label: "Aprovada com ressalvas",
    tone: "warn",
    description: "Contas aprovadas, com ressalvas registradas pelo órgão.",
  },
  rejeitada: { label: "Rejeitada", tone: "bad", description: "Contas rejeitadas pelo órgão." },
};

/**
 * Decreto 8.726/2016: a divulgação vai da celebração até 180 dias após a apresentação da
 * prestação de contas final.
 */
const DISCLOSURE_DAYS_AFTER_FINAL_REPORT = 180;

export function disclosureUntil(partnership: Partnership): string | null {
  const submitted = partnership.accountability.submittedAt;
  return submitted ? addDays(submitted, DISCLOSURE_DAYS_AFTER_FINAL_REPORT) : null;
}

/** Custo de uma função: salário mensal × meses × pessoas. */
export function memberTotal(member: TeamMember): number {
  return member.monthlyPay * member.months * (member.people ?? 1);
}

export function teamTotal(team: TeamMember[]): number {
  return team.reduce((sum, member) => sum + memberTotal(member), 0);
}

/** Percentual do valor total já liberado, 0–100. */
export function releasedPercent(partnership: Partnership): number {
  if (partnership.totalValue <= 0) return 0;
  return Math.min(100, Math.round((partnership.releasedValue / partnership.totalValue) * 100));
}

export type PartnershipSummary = {
  count: number;
  total: number;
  released: number;
  /** Parcerias com contas aprovadas (com ou sem ressalvas). */
  approved: number;
};

export function summarizePartnerships(partnerships: Partnership[]): PartnershipSummary {
  return partnerships.reduce<PartnershipSummary>(
    (acc, p) => ({
      count: acc.count + 1,
      total: acc.total + p.totalValue,
      released: acc.released + p.releasedValue,
      approved:
        acc.approved +
        (p.accountability.status === "aprovada" ||
        p.accountability.status === "aprovada-com-ressalvas"
          ? 1
          : 0),
    }),
    { count: 0, total: 0, released: 0, approved: 0 },
  );
}

const yearOf = (p: Partnership) => Number(p.signedAt.slice(0, 4));

/** Anos de assinatura, do mais recente ao mais antigo. */
export function partnershipYears(partnerships: Partnership[]): number[] {
  return [...new Set(partnerships.map(yearOf))].sort((a, b) => b - a);
}

/** Mais recentes primeiro. */
export function sortPartnerships(partnerships: Partnership[]): Partnership[] {
  return [...partnerships].sort(
    (a, b) => b.signedAt.localeCompare(a.signedAt) || a.id.localeCompare(b.id),
  );
}

export type PartnershipFilter = {
  year?: number | "todos";
  status?: AccountabilityStatus | "todas";
  query?: string;
};

/** Busca por instrumento, órgão ou objeto, sem diferenciar acentos e maiúsculas. */
export function filterPartnerships(
  partnerships: Partnership[],
  filter: PartnershipFilter,
): Partnership[] {
  const query = normalizeText(filter.query ?? "");
  return partnerships.filter((p) => {
    if (filter.year && filter.year !== "todos" && yearOf(p) !== filter.year) return false;
    if (filter.status && filter.status !== "todas" && p.accountability.status !== filter.status)
      return false;
    if (!query) return true;
    return normalizeText(`${p.instrument} ${p.agency} ${p.object}`).includes(query);
  });
}
