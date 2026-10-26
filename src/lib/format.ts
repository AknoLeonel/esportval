const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const MONTH_YEAR = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  month: "short",
  year: "numeric",
});
const SHORT_DATE = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", dateStyle: "short" });
const LONG_DATE = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const utc = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`);

/** R$ 1.234,56 (com espaço comum, para não quebrar buscas e testes). */
export function formatBRL(value: number): string {
  return BRL.format(value).replace(/ /g, " ");
}

/** 10/03/2025 a partir de yyyy-mm-dd. */
export function formatDate(isoDate: string): string {
  return SHORT_DATE.format(utc(isoDate));
}

/** 1 de novembro de 2026 a partir de yyyy-mm-dd. */
export function formatLongDate(isoDate: string): string {
  return LONG_DATE.format(utc(isoDate));
}

/** mar/2025 a partir de yyyy-mm. */
export function formatMonthYear(yearMonth: string): string {
  const parts = MONTH_YEAR.formatToParts(utc(`${yearMonth}-01`));
  const month = parts.find((p) => p.type === "month")?.value.replace(".", "") ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  return `${month}/${year}`;
}

export function formatPeriod(period: { start: string; end?: string }): string {
  const start = formatMonthYear(period.start);
  if (!period.end) return `desde ${start}`;
  return period.end === period.start ? start : `${start} – ${formatMonthYear(period.end)}`;
}

/** Para buscas: minúsculas e sem acentos. */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/** Soma dias a uma data yyyy-mm-dd (UTC) e devolve yyyy-mm-dd. */
export function addDays(isoDate: string, days: number): string {
  const date = utc(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
