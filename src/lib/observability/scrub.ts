export type EventProps = Record<string, string | number | boolean | undefined>;

/** Campos que nunca podem sair do app para ferramentas de observabilidade (dados pessoais). */
const PII_KEYS =
  /^(e-?mail|phone|telefone|whatsapp|name|nome|message|mensagem|password|senha|token|cpf)$/i;

export function scrub(props?: EventProps): EventProps | undefined {
  if (!props) return undefined;
  const clean: EventProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (!PII_KEYS.test(key)) clean[key] = value;
  }
  return clean;
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error("Erro desconhecido");
  }
}
