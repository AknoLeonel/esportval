import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { MediaItem } from "@/lib/types";
import { Gallery } from "./Gallery";

const items: MediaItem[] = [
  { id: "1", src: "/gallery/quadra-1.svg", alt: "Um", caption: "Dia de jogo" },
  { id: "2", src: "/gallery/quadra-2.svg", alt: "Dois", caption: "Treino" },
  { id: "3", src: "/gallery/quadra-3.svg", alt: "Três", caption: "Saída" },
];

describe("Gallery", () => {
  it("abre o lightbox, trava a rolagem e devolve o foco ao fechar com Esc", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);
    const trigger = screen.getByRole("button", { name: "Ampliar: Treino" });

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(trigger).toHaveFocus();
  });

  it("navega com setas e botões, dando a volta nas pontas", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);
    await user.click(screen.getByRole("button", { name: "Ampliar: Dia de jogo" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("1/3");

    await user.keyboard("{ArrowLeft}");
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("3/3"));

    await user.click(screen.getByRole("button", { name: "Próxima foto" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("1/3"));

    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("2/3"));

    await user.click(screen.getByRole("button", { name: "Foto anterior" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("1/3"));
  });

  it("fecha ao clicar no fundo, mas não ao clicar na imagem", async () => {
    const user = userEvent.setup();
    render(<Gallery items={items} />);
    await user.click(screen.getByRole("button", { name: "Ampliar: Saída" }));
    const dialog = await screen.findByRole("dialog");

    await user.click(dialog.querySelector("figure") as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
