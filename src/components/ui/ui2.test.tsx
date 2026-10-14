import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, ButtonLink } from "./Button";
import { LazyImage } from "./LazyImage";
import { MotionProvider } from "./Providers";
import { ScrollProgress } from "./ScrollProgress";
import { Section } from "./Section";

describe("Button / ButtonLink", () => {
  it("botão repassa props e aplica variante", () => {
    render(
      <Button variant="secondary" disabled>
        Ok
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Ok" })).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("bg-ink-700");
  });

  it("link interno usa next/link e externo abre em nova aba com rel seguro", () => {
    const { rerender } = render(<ButtonLink href="#contato">Ir</ButtonLink>);
    expect(screen.getByRole("link", { name: "Ir" })).toHaveAttribute("href", "#contato");
    rerender(
      <ButtonLink href="https://instagram.com/esportval" external>
        Insta
      </ButtonLink>,
    );
    const link = screen.getByRole("link", { name: "Insta" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("Section", () => {
  it("liga o título à região e mostra o selo ilustrativo só quando pedido", () => {
    const { rerender } = render(
      <Section id="jogos" eyebrow="Agenda" title="Jogos" description="Desc">
        <p>filho</p>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Jogos" })).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo ilustrativo")).not.toBeInTheDocument();
    rerender(
      <Section id="jogos" eyebrow="Agenda" title="Jogos" illustrative>
        <p>filho</p>
      </Section>,
    );
    expect(screen.getByText("Conteúdo ilustrativo")).toBeInTheDocument();
  });
});

describe("LazyImage", () => {
  it("mostra skeleton até a imagem carregar e então a revela", async () => {
    const { container } = render(
      <LazyImage src="/gallery/quadra-1.svg" alt="Quadra" width={10} height={10} unoptimized />,
    );
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
    const image = screen.getByAltText("Quadra");
    expect(image).toHaveClass("opacity-0");
    expect(image).toHaveAttribute("loading", "lazy");

    fireEvent.load(image);

    await waitFor(() => expect(container.querySelector(".skeleton")).not.toBeInTheDocument());
    expect(image).toHaveClass("opacity-100");
  });

  it("carrega na hora quando é prioridade", () => {
    render(
      <LazyImage src="/gallery/quadra-1.svg" alt="Hero" width={10} height={10} unoptimized eager />,
    );
    expect(screen.getByAltText("Hero")).toHaveAttribute("loading", "eager");
  });
});

describe("Providers / ScrollProgress", () => {
  it("renderizam sem quebrar", () => {
    render(
      <MotionProvider>
        <ScrollProgress />
        <p>ok</p>
      </MotionProvider>,
    );
    expect(screen.getByTestId("scroll-progress")).toHaveAttribute("aria-hidden", "true");
  });
});
