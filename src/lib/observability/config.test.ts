import { describe, expect, it } from "vitest";
import { datadogConfig, environmentName, newRelicConfig, sentryDsn } from "./config";

describe("datadogConfig", () => {
  it("fica desligado sem chaves", () => {
    expect(datadogConfig({})).toBeNull();
    expect(datadogConfig({ NEXT_PUBLIC_DD_APPLICATION_ID: "app" })).toBeNull();
    expect(
      datadogConfig({ NEXT_PUBLIC_DD_APPLICATION_ID: " ", NEXT_PUBLIC_DD_CLIENT_TOKEN: "t" }),
    ).toBeNull();
  });

  it("liga com application id e token, com site padrão", () => {
    expect(
      datadogConfig({ NEXT_PUBLIC_DD_APPLICATION_ID: " app ", NEXT_PUBLIC_DD_CLIENT_TOKEN: "tok" }),
    ).toEqual({ applicationId: "app", clientToken: "tok", site: "datadoghq.com" });
  });

  it("aceita site customizado", () => {
    expect(
      datadogConfig({
        NEXT_PUBLIC_DD_APPLICATION_ID: "a",
        NEXT_PUBLIC_DD_CLIENT_TOKEN: "t",
        NEXT_PUBLIC_DD_SITE: "datadoghq.eu",
      })?.site,
    ).toBe("datadoghq.eu");
  });
});

describe("newRelicConfig", () => {
  const full = {
    NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID: "1",
    NEXT_PUBLIC_NEWRELIC_AGENT_ID: "2",
    NEXT_PUBLIC_NEWRELIC_LICENSE_KEY: "key",
    NEXT_PUBLIC_NEWRELIC_APPLICATION_ID: "3",
  };

  it("fica desligado se faltar qualquer chave obrigatória", () => {
    expect(newRelicConfig({})).toBeNull();
    for (const missing of Object.keys(full)) {
      const partial = { ...full, [missing]: undefined };
      expect(newRelicConfig(partial)).toBeNull();
    }
  });

  it("usa a conta como trust key quando não informada", () => {
    expect(newRelicConfig(full)).toEqual({
      accountId: "1",
      trustKey: "1",
      agentId: "2",
      licenseKey: "key",
      applicationId: "3",
    });
  });

  it("respeita a trust key informada", () => {
    expect(newRelicConfig({ ...full, NEXT_PUBLIC_NEWRELIC_TRUST_KEY: "9" })?.trustKey).toBe("9");
  });
});

describe("sentryDsn", () => {
  it("devolve null sem DSN", () => {
    expect(sentryDsn({})).toBeNull();
    expect(sentryDsn({ NEXT_PUBLIC_SENTRY_DSN: "  " })).toBeNull();
  });
  it("devolve o DSN limpo", () => {
    expect(sentryDsn({ NEXT_PUBLIC_SENTRY_DSN: " https://k@o.ingest.sentry.io/1 " })).toBe(
      "https://k@o.ingest.sentry.io/1",
    );
  });
});

describe("environmentName", () => {
  it("prefere o ambiente da Vercel", () => {
    expect(environmentName({ NEXT_PUBLIC_VERCEL_ENV: "preview" }, "production")).toBe("preview");
  });
  it("cai no NODE_ENV", () => {
    expect(environmentName({}, "production")).toBe("production");
    expect(environmentName({}, undefined)).toBe("development");
  });
});
