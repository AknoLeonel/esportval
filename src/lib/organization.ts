/** Texto exibido enquanto um dado institucional não foi informado. */
export const PENDING = "em atualização";

type OrganizationData = { legalName: string | null; cnpj: string | null };

export function orField(value: string | null): string {
  return value ?? PENDING;
}

/** Identificação exigida pelo art. 11, II da Lei 13.019/2014: nome da organização e CNPJ. */
export function organizationLabel(org: OrganizationData, fallbackName: string): string {
  return `${org.legalName ?? fallbackName} — CNPJ ${orField(org.cnpj)}`;
}
