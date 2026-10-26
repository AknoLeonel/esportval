import type { Player, StaffMember } from "@/lib/types";

/** Dados ilustrativos de elenco: nomes fictícios, sem sobrenome. */
const players: Player[] = [
  { id: "p01", name: "Rafael", number: 1, position: "Goleiro" },
  { id: "p12", name: "Davi", number: 12, position: "Goleiro" },
  { id: "p04", name: "Thiago", number: 4, position: "Fixo" },
  { id: "p05", name: "Marcos", number: 5, position: "Fixo" },
  { id: "p15", name: "Caio", number: 15, position: "Fixo" },
  { id: "p07", name: "Lucas", number: 7, position: "Ala" },
  { id: "p08", name: "Pedro", number: 8, position: "Ala" },
  { id: "p10", name: "Gabriel", number: 10, position: "Ala" },
  { id: "p11", name: "Enzo", number: 11, position: "Ala" },
  { id: "p09", name: "Bruno", number: 9, position: "Pivô" },
  { id: "p14", name: "Matheus", number: 14, position: "Pivô" },
  { id: "p17", name: "Vitor", number: 17, position: "Pivô" },
];

const staff: StaffMember[] = [
  { id: "s1", name: "Professor Marcelo", role: "Coach" },
  { id: "s2", name: "Juliana", role: "Preparação física" },
  { id: "s3", name: "Renato", role: "Coordenação" },
];

export async function getSquad(): Promise<{ players: Player[]; staff: StaffMember[] }> {
  return { players, staff };
}
