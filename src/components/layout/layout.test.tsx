import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Crest } from "../brand/Crest";
import { Logo } from "../brand/Logo";
import { Footer } from "./Footer";
import { Header } from "./Header";

const nav = [
  { href: "#jogos", label: "Jogos" },
  { href: "#elenco", label: "Elenco" },
];
const cta = { href: "#contato", label: "Quero treinar" };

describe("Header", () => {
  it("tem navegação principal e CTA", () => {
    render(<Header nav={nav} cta={cta} />);
    const main = screen.getByRole("navigation", { name: "Principal" });
    expect(main).toHaveTextContent("Jogos");
    expect(main).toHaveTextContent("Quero treinar");
  });

  it("abre e fecha o menu móvel (botão, link e Esc)", async () => {
    const user = userEvent.setup();
    render(<Header nav={nav} cta={cta} />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("navigation", { name: "Menu móvel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.keyboard("{Escape}");
    await act(async () => {});
    expect(await screen.findByRole("button", { name: "Abrir menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobile = screen.getByRole("navigation", { name: "Menu móvel" });
    await user.click(mobile.querySelector("a[href='#elenco']") as HTMLElement);
    expect(await screen.findByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  it("reage à rolagem", () => {
    render(<Header nav={nav} cta={cta} />);
    Object.defineProperty(window, "scrollY", { value: 200, configurable: true });
    fireEvent.scroll(window);
    expect(screen.getByRole("banner")).toHaveClass("backdrop-blur-md");
  });
});

describe("Footer", () => {
  it("mostra links de navegação, Instagram seguro e o ano atual", () => {
    render(
      <Footer
        nav={nav}
        instagram={{ handle: "esportval", url: "https://instagram.com/esportval" }}
        tagline="Lema"
      />,
    );
    expect(screen.getByRole("link", { name: "Instagram @esportval" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "Elenco" })).toHaveAttribute("href", "#elenco");
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});

describe("marca", () => {
  it("escudo é decorativo por padrão e acessível quando recebe título", () => {
    const { container, rerender } = render(<Crest />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Crest title="Escudo Fut’Art" />);
    expect(screen.getByRole("img", { name: "Escudo Fut’Art" })).toBeInTheDocument();
  });

  it("logo tem versão compacta sem texto", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByText("Esportval")).toBeInTheDocument();
    rerender(<Logo compact />);
    expect(screen.queryByText("Esportval")).not.toBeInTheDocument();
  });
});
