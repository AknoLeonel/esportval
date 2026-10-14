import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const captureException = vi.fn();
const addBreadcrumb = vi.fn();
vi.mock("@sentry/nextjs", () => ({ captureException, addBreadcrumb }));

const { reportError, trackEvent } = await import("./index");
const { clearAdapters, registerAdapter } = await import("./registry");
const { normalizeError, scrub } = await import("./scrub");

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  clearAdapters();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("scrub", () => {
  it("remove dados pessoais", () => {
    expect(
      scrub({
        email: "a@b.c",
        Phone: "1",
        name: "Ana",
        message: "oi",
        feature: "contact",
        ok: true,
      }),
    ).toEqual({ feature: "contact", ok: true });
  });
  it("devolve undefined sem props", () => {
    expect(scrub(undefined)).toBeUndefined();
  });
});

describe("normalizeError", () => {
  it("mantém Error, converte string e objeto", () => {
    const err = new Error("x");
    expect(normalizeError(err)).toBe(err);
    expect(normalizeError("falhou").message).toBe("falhou");
    expect(normalizeError({ a: 1 }).message).toBe('{"a":1}');
  });
  it("lida com valores não serializáveis", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(normalizeError(cyclic).message).toBe("Erro desconhecido");
  });
});

describe("reportError", () => {
  it("envia ao Sentry e a todos os adapters sem dados pessoais", () => {
    const error = vi.fn();
    registerAdapter({ name: "fake", error });
    const failure = new Error("boom");

    reportError(failure, { route: "/api/contato", email: "a@b.c" });

    expect(captureException).toHaveBeenCalledWith(failure, { extra: { route: "/api/contato" } });
    expect(error).toHaveBeenCalledWith(failure, { route: "/api/contato" });
  });

  it("nunca lança, mesmo se um provedor falhar", () => {
    captureException.mockImplementationOnce(() => {
      throw new Error("sentry fora do ar");
    });
    registerAdapter({
      name: "ruim",
      error: () => {
        throw new Error("adapter quebrou");
      },
    });
    const ok = vi.fn();
    registerAdapter({ name: "bom", error: ok });

    expect(() => reportError("x")).not.toThrow();
    expect(ok).toHaveBeenCalledOnce();
  });
});

describe("trackEvent", () => {
  it("registra breadcrumb e notifica adapters", () => {
    const event = vi.fn();
    registerAdapter({ name: "fake", event });

    trackEvent("contact_submitted", { category: "Sub-11", phone: "123" });

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: "event",
      message: "contact_submitted",
      data: { category: "Sub-11" },
      level: "info",
    });
    expect(event).toHaveBeenCalledWith("contact_submitted", { category: "Sub-11" });
  });
});
