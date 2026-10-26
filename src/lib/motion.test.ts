import { describe, expect, it } from "vitest";
import {
  duration,
  filterItem,
  MAX_STAGGER_ITEMS,
  pop,
  type RevealCustom,
  reveal,
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

  it("nunca anima a partir de scale(0)", () => {
    expect((pop.hidden as { scale: number }).scale).toBeGreaterThanOrEqual(0.9);
  });
});

type Visible = {
  opacity: number;
  y: number;
  filter: string;
  transition: Record<string, unknown>;
  transitionEnd: { filter: string };
};
const visible = (custom?: RevealCustom) =>
  (reveal.visible as (c?: RevealCustom) => Visible)(custom);

describe("filterItem (filtros e busca)", () => {
  it("é rápido (≤180ms) e sem blur nem deslocamento", () => {
    const visible = filterItem.visible as { transition: { duration: number } };
    const exit = filterItem.exit as { transition: { duration: number } };
    expect(visible.transition.duration).toBeLessThanOrEqual(0.18);
    expect(exit.transition.duration).toBeLessThanOrEqual(visible.transition.duration);
    for (const state of Object.values(filterItem)) {
      expect(
        Object.keys(state as object)
          .filter((k) => k !== "transition")
          .sort(),
      ).toEqual(["opacity", "scale"]);
    }
    expect((filterItem.hidden as { scale: number }).scale).toBeGreaterThanOrEqual(0.9);
  });
});

describe("reveal.visible", () => {
  it("termina sem filter, para não criar bloco de contenção de position: fixed", () => {
    expect(visible().transitionEnd.filter).toBe("none");
  });

  it("anima as MESMAS chaves com ou sem movimento reduzido (senão o blur do SSR fica preso)", () => {
    const keys = (v: Visible) => Object.keys(v).sort();
    expect(keys(visible({ reduced: true }))).toEqual(keys(visible({ reduced: false })));
    expect(keys(visible({ reduced: true }))).toEqual(keys(visible()));
    for (const v of [visible(), visible({ reduced: true })]) {
      expect(v).toMatchObject({ opacity: 1, y: 0, filter: "blur(0px)" });
    }
  });

  it("com movimento reduzido só a opacidade leva tempo; deslocamento e blur são instantâneos", () => {
    const { transition } = visible({ reduced: true });
    expect(transition.y).toEqual({ duration: 0 });
    expect(transition.filter).toEqual({ duration: 0 });
    expect(transition.opacity).toEqual({ duration: duration.fast });
  });

  it("aplica o atraso da cascata na transição (a da variante vence a da prop)", () => {
    expect(visible({ delay: 0.15 }).transition.delay).toBe(0.15);
    expect(visible().transition.delay).toBe(0);
  });

  it("ignora o atraso com movimento reduzido: sem cascata", () => {
    expect(visible({ reduced: true, delay: 0.3 }).transition.delay).toBeUndefined();
  });
});
