import { describe, expect, it } from "vitest";
import { orField, organizationLabel, PENDING } from "./organization";

describe("dados institucionais", () => {
  it("mostra 'em atualização' enquanto não informados", () => {
    expect(orField(null)).toBe(PENDING);
    expect(orField("Associação X")).toBe("Associação X");
  });

  it("identificação da organização (art. 11, II)", () => {
    expect(organizationLabel({ legalName: null, cnpj: null }, "Esportval")).toBe(
      "Esportval — CNPJ em atualização",
    );
    expect(
      organizationLabel({ legalName: "Associação X", cnpj: "00.000.000/0001-00" }, "Esportval"),
    ).toBe("Associação X — CNPJ 00.000.000/0001-00");
  });
});
