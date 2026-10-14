type MatchStatus = "scheduled" | "finished";

export type Match = {
  id: string;
  /** ISO 8601 com fuso (America/Sao_Paulo). */
  date: string;
  competition: string;
  opponent: string;
  home: boolean;
  venue: string;
  status: MatchStatus;
  /** Presente somente em jogos finalizados. */
  score?: { for: number; against: number };
};

export type StandingInput = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  isUs?: boolean;
};

export type Position = "Goleiro" | "Fixo" | "Ala" | "Pivô";

export type Player = {
  id: string;
  name: string;
  number: number;
  position: Position;
};

export type StaffMember = { id: string; name: string; role: string };

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  category: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};
