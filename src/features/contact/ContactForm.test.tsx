import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reportError = vi.fn();
const trackEvent = vi.fn();
vi.mock("@/lib/observability", () => ({ reportError, trackEvent }));

const { ContactForm } = await import("./ContactForm");

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
  await user.type(screen.getByLabelText("E-mail"), "maria@example.com");
  await user.type(screen.getByLabelText("WhatsApp / telefone"), "(61) 91234-5678");
  await user.selectOptions(screen.getByLabelText("Categoria do atleta"), "Sub-13");
  await user.click(screen.getByRole("checkbox"));
}

beforeEach(() => {
  render(<ContactForm instagramUrl="https://instagram.com/esportval" />);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("ContactForm", () => {
  it("mostra erros por campo e foca no primeiro inválido sem enviar", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Informe seu nome completo.")).toBeInTheDocument();
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
    expect(screen.getByText("É preciso aceitar para enviarmos o retorno.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome completo")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Nome completo")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("envia, mostra progresso e confirma o sucesso", async () => {
    let resolve: (value: Response) => void = () => {};
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByRole("button", { name: /Enviando/ })).toBeDisabled();

    resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    expect(await screen.findByText("Recebemos seu contato!")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith("contact_submitted", { category: "Sub-13" });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: "maria@example.com",
      consent: true,
    });
  });

  it("avisa e reporta quando o servidor falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
    const user = userEvent.setup();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não conseguimos enviar agora");
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://instagram.com/esportval",
    );
    expect(reportError).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled());
  });

  it("exibe erros de validação vindos do servidor (422)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, errors: { email: "E-mail recusado." } }), {
          status: 422,
        }),
      ),
    );
    const user = userEvent.setup();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("E-mail recusado.")).toBeInTheDocument();
    expect(reportError).not.toHaveBeenCalled();
  });
});
