import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reportError = vi.fn();
const trackEvent = vi.fn();
vi.mock("@/lib/observability", () => ({ reportError, trackEvent }));

const { POST } = await import("./route");

const valid = {
  name: "Maria Souza",
  email: "maria@example.com",
  phone: "(61) 91234-5678",
  subject: "Transparência e prestação de contas",
  message: "Gostaria do relatório do festival.",
  consent: true,
};

const post = (body: unknown, init: RequestInit = {}) =>
  POST(
    new Request("http://localhost/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
      ...init,
    }),
  );

beforeEach(() => {
  vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example.com/abc");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("POST /api/contato", () => {
  it("encaminha o lead ao webhook e responde ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://hooks.example.com/abc");
    const sent = JSON.parse(init.body as string);
    expect(sent.lead).toMatchObject({
      name: "Maria Souza",
      subject: "Transparência e prestação de contas",
    });
    expect(sent.lead).not.toHaveProperty("consent");
    expect(sent.text).toContain("Maria Souza");
    expect(trackEvent).toHaveBeenCalledWith("contact_delivered", {
      subject: "Transparência e prestação de contas",
    });
    expect(sent.text).toContain("(61) 91234-5678");
  });

  it("mensagem sem telefone não imprime telefone vazio no aviso", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { phone: _phone, ...withoutPhone } = valid;
    expect((await post(withoutPhone)).status).toBe(200);
    const sent = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(sent.text).toBe(
      "Novo contato pelo site Esportval: Maria Souza (Transparência e prestação de contas) — maria@example.com",
    );
  });

  it("devolve 422 com erros por campo", async () => {
    const response = await post({ ...valid, email: "x", name: "" });
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(Object.keys(body.errors).sort()).toEqual(["email", "name"]);
  });

  it("devolve 400 para JSON inválido", async () => {
    const response = await post("{nao-json");
    expect(response.status).toBe(400);
  });

  it("devolve 413 para corpo grande demais", async () => {
    const response = await post(valid, {
      headers: { "Content-Type": "application/json", "content-length": "20000" },
    });
    expect(response.status).toBe(413);
  });

  it("descarta robôs (honeypot) sem chamar o webhook", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await post({ ...valid, website: "http://spam.example" });
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("devolve 503 e reporta erro quando o webhook não está configurado", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    const response = await post(valid);
    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("not_configured");
    expect(reportError).toHaveBeenCalledOnce();
  });

  it("devolve 502 quando o webhook falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("no", { status: 500 })));
    const response = await post(valid);
    expect(response.status).toBe(502);
    expect(reportError).toHaveBeenCalledOnce();
  });

  it("devolve 502 quando a rede falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    const response = await post(valid);
    expect(response.status).toBe(502);
  });
});
