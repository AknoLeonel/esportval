import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors } from "./contact-schema";

const valid = {
  name: "Maria Souza",
  email: "maria@example.com",
  subject: "Parceria ou patrocínio",
  message: "Queremos apoiar o próximo projeto.",
  consent: true,
};

describe("contactSchema", () => {
  it("aceita um contato válido, com telefone opcional", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "(61) 91234-5678" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });

  it("remove espaços das pontas", () => {
    expect(contactSchema.parse({ ...valid, name: "  Maria Souza  " }).name).toBe("Maria Souza");
  });

  it.each([
    ["nome curto", { name: "A" }, "name"],
    ["e-mail inválido", { email: "maria@" }, "email"],
    ["telefone inválido", { phone: "123" }, "phone"],
    ["assunto fora da lista", { subject: "Vendas" }, "subject"],
    ["mensagem curta", { message: "oi" }, "message"],
    ["mensagem longa", { message: "x".repeat(1501) }, "message"],
    ["sem consentimento", { consent: false }, "consent"],
  ])("rejeita %s", (_label, patch, field) => {
    const result = contactSchema.safeParse({ ...valid, ...patch });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(fieldErrors(result.error)[field as keyof typeof valid]).toBeTruthy();
  });

  it("rejeita honeypot preenchido", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("mantém só o primeiro erro de cada campo", () => {
    const result = contactSchema.safeParse({ ...valid, name: "" });
    if (result.success) throw new Error("deveria falhar");
    expect(Object.keys(fieldErrors(result.error))).toEqual(["name"]);
  });

  it("campos ausentes (chamada direta à API) têm mensagens em português", () => {
    const result = contactSchema.safeParse({});
    if (result.success) throw new Error("deveria falhar");
    const errors = fieldErrors(result.error);
    expect(errors.name).toBe("Informe seu nome.");
    expect(errors.email).toBe("Informe um e-mail válido.");
    expect(errors.message).toBe("Escreva sua mensagem.");
    expect(errors.subject).toBe("Escolha um assunto.");
    const phone = contactSchema.safeParse({ phone: null });
    if (phone.success) throw new Error("deveria falhar");
    expect(fieldErrors(phone.error).phone).toBe("Informe um telefone com DDD ou deixe em branco.");
  });
});
