import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/", search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const { Logo } = await import("../brand/Logo");
const { Mark } = await import("../brand/Mark");
const { Footer } = await import("./Footer");
const { Header } = await import("./Header");

const nav = [
  { href: "/projetos", label: "Projetos" },
  { href: "/#sobre", label: "Quem somos" },
];
const cta = { href: "/transparencia", label: "Transparência" };

beforeEach(() => {
  navigation.pathname = "/";
});

describe("Header", () => {
  it("tem navegação principal e o destaque para a transparência", () => {
    render(<Header nav={nav} cta={cta} />);
    const main = screen.getByRole("navigation", { name: "Principal" });
    expect(main).toHaveTextContent("Projetos");
    expect(main).toHaveTextContent("Transparência");
  });

  it("marca a página atual, inclusive nas páginas filhas, e nunca links com âncora", () => {
    navigation.pathname = "/projetos/festival-multiesportes";
    render(<Header nav={nav} cta={cta} />);
    const main = screen.getByRole("navigation", { name: "Principal" });
    expect(main.querySelector("a[href='/projetos']")).toHaveAttribute("aria-current", "page");
    expect(main.querySelector("a[href='/#sobre']")).not.toHaveAttribute("aria-current");
    expect(main.querySelector("a[href='/transparencia']")).not.toHaveAttribute("aria-current");
  });

  it("o botão de destaque também indica a página atual", () => {
    navigation.pathname = "/transparencia";
    render(<Header nav={nav} cta={cta} />);
    const main = screen.getByRole("navigation", { name: "Principal" });
    expect(main.querySelector("a[href='/transparencia']")).toHaveAttribute("aria-current", "page");
  });

  it("não marca prefixo parcial como página atual", () => {
    navigation.pathname = "/projetos-antigos";
    render(<Header nav={nav} cta={cta} />);
    expect(
      screen.getByRole("navigation", { name: "Principal" }).querySelector("[aria-current]"),
    ).toBeNull();
  });

  it("abre e fecha o menu móvel (botão, link e Esc)", async () => {
    const user = userEvent.setup();
    render(<Header nav={nav} cta={cta} />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("navigation", { name: "Menu móvel" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await act(async () => {});
    expect(await screen.findByRole("button", { name: "Abrir menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobile = screen.getByRole("navigation", { name: "Menu móvel" });
    await user.click(mobile.querySelector("a[href='/#sobre']") as HTMLElement);
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
  const props = {
    nav,
    instagram: { handle: "esportval", url: "https://instagram.com/esportval" },
    motto: "Lema",
  };

  it("mostra dados da associação como 'em atualização' enquanto não informados", () => {
    render(<Footer {...props} organization={{ legalName: null, cnpj: null }} />);
    expect(screen.getByText("Razão social:").nextSibling).toHaveTextContent("em atualização");
    expect(screen.getByText("CNPJ:").nextSibling).toHaveTextContent("em atualização");
    expect(screen.getByRole("link", { name: "Instagram @esportval" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it("mostra razão social e CNPJ quando existem", () => {
    render(
      <Footer
        {...props}
        organization={{ legalName: "Associação Esportval", cnpj: "00.000.000/0001-00" }}
      />,
    );
    expect(screen.getByText("Associação Esportval")).toBeInTheDocument();
    expect(screen.getByText("00.000.000/0001-00")).toBeInTheDocument();
  });
});

describe("marca", () => {
  it("bola multiesportiva é decorativa por padrão e acessível com título", () => {
    const { container, rerender } = render(<Mark />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Mark title="Esportval" />);
    expect(screen.getByRole("img", { name: "Esportval" })).toBeInTheDocument();
  });

  it("logo tem versão compacta sem texto", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByText("Esportval")).toBeInTheDocument();
    rerender(<Logo compact />);
    expect(screen.queryByText("Esportval")).not.toBeInTheDocument();
  });
});
