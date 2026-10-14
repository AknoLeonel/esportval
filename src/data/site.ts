export const site = {
  name: "Esportval Futsal",
  crestName: "Fut’Art",
  tagline: "Oportunidades não surgem. É você que as cria.",
  description:
    "Projeto Futsal Esportval: jogos, classificação, elenco e inscrições para treinar com a gente.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://esportval.vercel.app",
  instagram: { handle: "esportval", url: "https://www.instagram.com/esportval/" },
  /**
   * Enquanto `true`, as seções com dados de demonstração exibem o selo "Conteúdo ilustrativo".
   * Troque para `false` depois de substituir os arquivos de src/data pelo conteúdo real do clube.
   */
  illustrativeContent: true,
} as const;

export const nav = [
  { href: "#jogos", label: "Jogos" },
  { href: "#classificacao", label: "Classificação" },
  { href: "#elenco", label: "Elenco" },
  { href: "#noticias", label: "Notícias" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
] as const;
