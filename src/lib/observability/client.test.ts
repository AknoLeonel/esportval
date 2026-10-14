import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("initClientObservability", () => {
  it("sem chaves não carrega nenhum SDK e não lança", async () => {
    const init = vi.fn();
    vi.doMock("@datadog/browser-rum", () => ({ datadogRum: { init } }));
    const { initClientObservability } = await import("./client");
    const { listAdapters } = await import("./registry");

    expect(() => initClientObservability()).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(init).not.toHaveBeenCalled();
    expect(listAdapters()).toHaveLength(0);
  });

  it("com chaves do Datadog inicia o RUM e registra o adapter", async () => {
    vi.stubEnv("NEXT_PUBLIC_DD_APPLICATION_ID", "app-id");
    vi.stubEnv("NEXT_PUBLIC_DD_CLIENT_TOKEN", "pub-token");
    const datadogRum = { init: vi.fn(), addError: vi.fn(), addAction: vi.fn() };
    vi.doMock("@datadog/browser-rum", () => ({ datadogRum }));
    const { initClientObservability } = await import("./client");
    const { listAdapters } = await import("./registry");

    initClientObservability();
    initClientObservability(); // idempotente
    await vi.waitFor(() => expect(listAdapters().map((a) => a.name)).toContain("datadog"));

    expect(datadogRum.init).toHaveBeenCalledOnce();
    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: "app-id",
        clientToken: "pub-token",
        service: "esportval",
        sessionReplaySampleRate: 0,
      }),
    );

    const adapter = listAdapters().find((a) => a.name === "datadog");
    const failure = new Error("x");
    adapter?.error?.(failure, { route: "/" });
    adapter?.event?.("click", { a: 1 });
    expect(datadogRum.addError).toHaveBeenCalledWith(failure, { route: "/" });
    expect(datadogRum.addAction).toHaveBeenCalledWith("click", { a: 1 });
  });

  it("com chaves do New Relic inicia o agente e registra o adapter", async () => {
    vi.stubEnv("NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID", "1");
    vi.stubEnv("NEXT_PUBLIC_NEWRELIC_AGENT_ID", "2");
    vi.stubEnv("NEXT_PUBLIC_NEWRELIC_LICENSE_KEY", "NRJS-key");
    vi.stubEnv("NEXT_PUBLIC_NEWRELIC_APPLICATION_ID", "3");
    const instance = { noticeError: vi.fn(), addPageAction: vi.fn() };
    const BrowserAgent = vi.fn(function () {
      return instance;
    });
    vi.doMock("@newrelic/browser-agent/loaders/browser-agent", () => ({ BrowserAgent }));
    const { initClientObservability } = await import("./client");
    const { listAdapters } = await import("./registry");

    initClientObservability();
    await vi.waitFor(() => expect(listAdapters().map((a) => a.name)).toContain("newrelic"));

    expect(BrowserAgent).toHaveBeenCalledOnce();
    const adapter = listAdapters().find((a) => a.name === "newrelic");
    adapter?.error?.(new Error("y"));
    adapter?.event?.("ev");
    expect(instance.noticeError).toHaveBeenCalled();
    expect(instance.addPageAction).toHaveBeenCalledWith("ev", undefined);
  });
});
