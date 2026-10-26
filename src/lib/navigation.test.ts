import { describe, expect, it } from "vitest";
import { startsRouteChange } from "./navigation";

const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
const here = "https://esportval.vercel.app/projetos";

describe("startsRouteChange", () => {
  it("link interno para outra página", () => {
    expect(startsRouteChange({ href: "/transparencia" }, click, here)).toBe(true);
    expect(startsRouteChange({ href: "https://esportval.vercel.app/" }, click, here)).toBe(true);
    expect(startsRouteChange({ href: "/projetos?modalidade=volei" }, click, here)).toBe(true);
  });

  it("âncora na mesma página não conta", () => {
    expect(startsRouteChange({ href: "/projetos#lista" }, click, here)).toBe(false);
    expect(startsRouteChange({ href: "#lista" }, click, here)).toBe(false);
  });

  it("ida para âncora em OUTRA página conta", () => {
    expect(startsRouteChange({ href: "/#contato" }, click, here)).toBe(true);
  });

  it("externo, nova aba, download e href inválido não contam", () => {
    expect(startsRouteChange({ href: "https://instagram.com/esportval" }, click, here)).toBe(false);
    expect(startsRouteChange({ href: "/transparencia", target: "_blank" }, click, here)).toBe(
      false,
    );
    expect(
      startsRouteChange({ href: "/documentos/estatuto.pdf", hasDownload: true }, click, here),
    ).toBe(false);
    expect(startsRouteChange({ href: "/x" }, click, "nao-e-url")).toBe(false);
  });

  it("_self conta como mesma aba", () => {
    expect(startsRouteChange({ href: "/transparencia", target: "_self" }, click, here)).toBe(true);
  });

  it("cliques com modificador ou botão do meio não contam", () => {
    for (const mod of ["metaKey", "ctrlKey", "shiftKey", "altKey"] as const) {
      expect(startsRouteChange({ href: "/transparencia" }, { ...click, [mod]: true }, here)).toBe(
        false,
      );
    }
    expect(startsRouteChange({ href: "/transparencia" }, { ...click, button: 1 }, here)).toBe(
      false,
    );
  });
});
