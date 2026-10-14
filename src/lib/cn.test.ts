import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("junta classes e ignora valores falsos", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("devolve string vazia sem classes", () => {
    expect(cn(false, undefined)).toBe("");
  });
});
