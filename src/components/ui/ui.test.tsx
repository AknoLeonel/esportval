import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CountUp } from "./CountUp";
import { LazyOnView } from "./LazyOnView";
import { ProgressBar } from "./ProgressBar";
import { Reveal } from "./Reveal";
import { Skeleton, SkeletonRegion, SkeletonText } from "./Skeleton";
import { Spinner } from "./Spinner";

describe("Skeleton", () => {
  it("é decorativo e a região anuncia o carregamento uma vez", () => {
    render(
      <SkeletonRegion label="Carregando jogos">
        <Skeleton className="h-4" />
        <SkeletonText lines={3} />
      </SkeletonRegion>,
    );
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-busy", "true");
    expect(region).toHaveTextContent("Carregando jogos");
    expect(region.querySelectorAll(".skeleton")).toHaveLength(4);
    expect(region.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
  });

  it("última linha do texto é mais curta", () => {
    const { container } = render(<SkeletonText lines={2} />);
    const lines = container.querySelectorAll(".skeleton");
    expect(lines[0]).toHaveClass("w-full");
    expect(lines[1]).toHaveClass("w-2/3");
  });
});

describe("ProgressBar", () => {
  it("expõe valor acessível e limita entre 0 e 100", () => {
    const { rerender } = render(<ProgressBar value={67.4} label="Aproveitamento" />);
    const bar = screen.getByRole("progressbar", { name: "Aproveitamento" });
    expect(bar).toHaveAttribute("aria-valuenow", "67");
    expect(bar).toHaveAttribute("aria-valuetext", "Aproveitamento: 67%");

    rerender(<ProgressBar value={140} label="Aproveitamento" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<ProgressBar value={-5} label="Aproveitamento" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});

describe("Reveal", () => {
  it("renderiza o conteúdo (acessível mesmo antes da animação terminar)", () => {
    render(
      <Reveal as="section" className="x">
        <p>Conteúdo</p>
      </Reveal>,
    );
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});

describe("LazyOnView", () => {
  it("troca o skeleton pelo conteúdo quando chega perto da tela", async () => {
    await act(async () => {
      render(
        <LazyOnView fallback={<p>carregando…</p>}>
          <p>pronto</p>
        </LazyOnView>,
      );
    });
    expect(screen.getByText("pronto")).toBeInTheDocument();
    expect(screen.queryByText("carregando…")).not.toBeInTheDocument();
  });
});

describe("CountUp", () => {
  it("traz o valor final no HTML inicial (SEO/sem JS)", () => {
    render(<CountUp value={67} suffix="%" />);
    expect(screen.getByText("67%")).toBeInTheDocument();
  });
});

describe("Spinner", () => {
  it("é decorativo", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
