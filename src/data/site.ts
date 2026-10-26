type Organization = {
  /** Razão social conforme o CNPJ. */
  legalName: string | null;
  cnpj: string | null;
  address: string | null;
  email: string | null;
};

export const site = {
  name: "Esportval",
  motto: "Oportunidades não surgem. É você que as cria.",
  headline: "Projetos esportivos com as contas abertas.",
  description:
    "A Esportval realiza projetos esportivos e publica aqui cada parceria, documento e prestação de contas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://esportval.vercel.app",
  instagram: { handle: "esportval", url: "https://www.instagram.com/esportval/" },
  /** Dados institucionais (art. 11, II da Lei 13.019/2014). `null` aparece como "em atualização". */
  organization: {
    legalName: null,
    cnpj: null,
    address: null,
    email: null,
  } satisfies Organization as Organization,
  /**
   * Enquanto `true`, registros de exemplo exibem o selo "Exemplo".
   * Troque para `false` depois de substituir src/data pelo conteúdo real da associação.
   */
  illustrativeContent: true,
};

export const nav = [
  { href: "/projetos", label: "Projetos" },
  { href: "/#sobre", label: "Quem somos" },
  { href: "/#contato", label: "Contato" },
] as const;

/** Botão de destaque do header: a prestação de contas é o motivo do site existir. */
export const headerCta = { href: "/transparencia", label: "Transparência" } as const;
