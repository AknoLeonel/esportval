import { z } from "zod";

export const AGE_CATEGORIES = ["Sub-9", "Sub-11", "Sub-13", "Sub-15", "Sub-17", "Adulto"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo.").max(80, "Nome muito longo."),
  email: z.string().trim().max(120).pipe(z.email("Informe um e-mail válido.")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,18}$/, "Informe um telefone com DDD."),
  category: z.enum(AGE_CATEGORIES, { error: "Escolha uma categoria." }),
  message: z.string().trim().max(600, "Mensagem muito longa (máx. 600 caracteres).").optional(),
  consent: z.literal(true, { error: "É preciso aceitar para enviarmos o retorno." }),
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
