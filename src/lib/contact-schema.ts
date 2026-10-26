import { z } from "zod";

export const SUBJECTS = [
  "Parceria ou patrocínio",
  "Transparência e prestação de contas",
  "Participar de um projeto",
  "Imprensa",
  "Outro assunto",
] as const;

export const contactSchema = z.object({
  name: z
    .string({ error: "Informe seu nome." })
    .trim()
    .min(2, "Informe seu nome.")
    .max(80, "Nome muito longo."),
  email: z
    .string({ error: "Informe um e-mail válido." })
    .trim()
    .max(120)
    .pipe(z.email("Informe um e-mail válido.")),
  phone: z
    .string({ error: "Informe um telefone com DDD ou deixe em branco." })
    .trim()
    .regex(/^(\+?[\d\s()-]{10,18})?$/, "Informe um telefone com DDD ou deixe em branco.")
    .optional(),
  subject: z.enum(SUBJECTS, { error: "Escolha um assunto." }),
  message: z
    .string({ error: "Escreva sua mensagem." })
    .trim()
    .min(10, "Escreva sua mensagem (mínimo de 10 caracteres).")
    .max(1500, "Mensagem muito longa (máx. 1.500 caracteres)."),
  consent: z.literal(true, { error: "É preciso aceitar para respondermos." }),
  /** Honeypot: humanos não preenchem. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Converte a lista de issues do Zod em um erro por campo (primeiro erro vence). */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
