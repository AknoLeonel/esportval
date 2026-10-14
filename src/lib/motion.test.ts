import { describe, expect, it } from "vitest";
import {
  duration,
  MAX_STAGGER_ITEMS,
  pop,
  reveal,
  revealReduced,
  STAGGER_STEP,
  staggerDelay,
} from "./motion";

describe("staggerDelay", () => {
  it("começa sem atraso", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("cresce linearmente com o índice", () => {
    expect(staggerDelay(3)).toBe(0.15);
    expect(staggerDelay(2, 0.1)).toBe(0.2);
  });

  it("limita o atraso máximo para listas longas", () => {
    expect(staggerDelay(100)).toBe(MAX_STAGGER_ITEMS * STAGGER_STEP);
  });

  it("ignora índices negativos", () => {
    expect(staggerDelay(-5)).toBe(0);
  });

  it("não acumula erro de ponto flutuante", () => {
    expect(staggerDelay(3, 0.1)).toBe(0.3);
  });
});

describe("tokens de motion", () => {
  it("mantém interações frequentes dentro do limite de 300ms (Emil)", () => {
    expect(duration.instant).toBeLessThanOrEqual(0.18);
    expect(duration.fast).toBeLessThanOrEqual(0.18);
    expect(duration.base).toBeLessThan(0.3);
  });

  it("a saída é mais sutil que a entrada (Jakub)", () => {
    const hidden = reveal.hidden as { y: number };
    const exit = reveal.exit as { y: number; transition: { duration: number } };
    expect(Math.abs(exit.y)).toBeLessThan(Math.abs(hidden.y));
    expect(exit.transition.duration).toBeLessThan(duration.enter);
  });

  it("movimento reduzido só anima opacidade", () => {
    for (const state of Object.values(revealReduced)) {
      expect(Object.keys(state as object).filter((k) => k !== "transition")).toEqual(["opacity"]);
    }
  });

  it("nunca anima a partir de scale(0)", () => {
    expect((pop.hidden as { scale: number }).scale).toBeGreaterThanOrEqual(0.9);
  });
});
