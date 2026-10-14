import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors } from "./contact-schema";

const valid = {
  name: "Maria Souza",
  email: "maria@example.com",
  phone: "(61) 91234-5678",
  category: "Sub-13",
  consent: true,
};

describe("contactSchema", () => {
  it("aceita um contato válido", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("remove espaços das pontas", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Maria Souza  " });
    expect(parsed.name).toBe("Maria Souza");
  });

  it.each([
    ["nome curto", { name: "A" }, "name"],
    ["e-mail inválido", { email: "maria@" }, "email"],
    ["telefone curto", { phone: "123" }, "phone"],
    ["categoria fora da lista", { category: "Sub-99" }, "category"],
    ["sem consentimento", { consent: false }, "consent"],
    ["mensagem longa", { message: "x".repeat(601) }, "message"],
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
});
