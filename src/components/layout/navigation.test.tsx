import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/", search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const { RouteProgress } = await import("./RouteProgress");
const { PageEnter } = await import("./PageEnter");

describe("RouteProgress", () => {
  it("acende ao clicar em link interno, completa quando a rota muda e some depois", async () => {
    const { rerender } = render(
      <>
        <RouteProgress />
        <a href="/transparencia">ir</a>
        <a href="#secao">âncora</a>
        <a href="https://instagram.com/esportval">fora</a>
      </>,
    );
    expect(screen.queryByTestId("route-progress")).toBeNull();

    // âncora e link externo não acendem
    act(() =>
      screen
        .getByText("âncora")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );
    act(() =>
      screen
        .getByText("fora")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );
    expect(screen.queryByTestId("route-progress")).toBeNull();

    act(() => {
      screen.getByText("ir").addEventListener("click", (e) => e.preventDefault(), { once: true });
      screen
        .getByText("ir")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    expect(screen.getByTestId("route-progress")).toHaveAttribute("data-phase", "loading");

    navigation.pathname = "/transparencia";
    rerender(
      <>
        <RouteProgress />
        <a href="/transparencia">ir</a>
      </>,
    );
    await waitFor(() => expect(screen.queryByTestId("route-progress")).toBeNull(), {
      timeout: 3000,
    });
  });

  it("é decorativa para leitores de tela", () => {
    render(
      <>
        <RouteProgress />
        <a href="/projetos">ir</a>
      </>,
    );
    act(() =>
      screen
        .getByText("ir")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );
    expect(screen.getByTestId("route-progress")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("PageEnter", () => {
  it("no primeiro carregamento não esconde o conteúdo (HTML do servidor já visível)", () => {
    const { container } = render(
      <PageEnter>
        <p>conteúdo</p>
      </PageEnter>,
    );
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
    expect((container.firstElementChild as HTMLElement).style.opacity).not.toBe("0");
  });

  it("nas navegações seguintes, entra a partir de opacidade 0", () => {
    const { container } = render(
      <PageEnter>
        <p>outra página</p>
      </PageEnter>,
    );
    expect((container.firstElementChild as HTMLElement).style.opacity).toBe("0");
  });
});
