import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Player, StaffMember } from "@/lib/types";
import { SquadGrid } from "./SquadGrid";

const players: Player[] = [
  { id: "1", name: "Rafael", number: 1, position: "Goleiro" },
  { id: "2", name: "Lucas", number: 7, position: "Ala" },
  { id: "3", name: "Bruno", number: 9, position: "Pivô" },
];
const staff: StaffMember[] = [{ id: "s", name: "Marcelo", role: "Coach" }];

describe("SquadGrid", () => {
  it("lista todos os atletas e a comissão técnica", () => {
    render(<SquadGrid players={players} staff={staff} />);
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(players.length);
    expect(screen.getByText("Rafael")).toBeInTheDocument();
    expect(screen.getByText("Marcelo")).toBeInTheDocument();
    expect(screen.getByText("3 atletas exibidos")).toBeInTheDocument();
  });

  it("filtra por posição e atualiza o aviso para leitores de tela", async () => {
    const user = userEvent.setup();
    render(<SquadGrid players={players} staff={staff} />);

    await user.click(screen.getByRole("button", { name: "Alas" }));

    expect(screen.getByRole("button", { name: "Alas" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 atletas exibidos")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Rafael")).not.toBeInTheDocument());
    expect(screen.getByText("Lucas")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Todos" }));
    expect(await screen.findByText("Rafael")).toBeInTheDocument();
  });
});
