export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type Modality = "Futsal" | "Vôlei" | "Basquete" | "Atletismo" | "Multiesportes";

export type ProjectStatus = "em-andamento" | "concluido";

export type Project = {
  slug: string;
  title: string;
  /** Uma frase: aparece nos cards e no compartilhamento. */
  summary: string;
  /** Parágrafos da página do projeto. */
  description: string[];
  modalities: Modality[];
  status: ProjectStatus;
  /** Meses no formato yyyy-mm. */
  period: { start: string; end?: string };
  location: string;
  audience: string;
  beneficiaries?: number;
  results: string[];
  cover: MediaItem;
  gallery: MediaItem[];
  /** Quem financiou (texto livre) e, se houver, a parceria publicada na transparência. */
  funding?: string;
  partnershipId?: string;
  /** Registro de exemplo, ainda sem dados reais do cliente. */
  illustrative?: boolean;
};

/** Situação da prestação de contas (Lei 13.019/2014, art. 11, V). */
export type AccountabilityStatus =
  | "em-execucao"
  | "a-apresentar"
  | "em-analise"
  | "aprovada"
  | "aprovada-com-ressalvas"
  | "rejeitada";

type PublicDocument = {
  title: string;
  /** Caminho do PDF em /public/documentos ou URL externa. Sem href = ainda não publicado. */
  href?: string;
  /** yyyy-mm-dd */
  publishedAt?: string;
};

/** Integrante da equipe pago com recursos da parceria (art. 11, VI). */
export type TeamMember = {
  role: string;
  /** Remuneração mensal por pessoa (R$). */
  monthlyPay: number;
  months: number;
  /** Quantas pessoas exercem a função (padrão 1). */
  people?: number;
};

/** Parceria com a administração pública, com os campos mínimos do art. 11 da Lei 13.019/2014. */
export type Partnership = {
  id: string;
  /** I. Instrumento (ex.: Termo de Fomento nº 12/2025). */
  instrument: string;
  /** I. Órgão da administração pública responsável. */
  agency: string;
  /** I. Data de assinatura, yyyy-mm-dd. */
  signedAt: string;
  /** III. Objeto. */
  object: string;
  /** IV. Valor total e valores liberados (R$). */
  totalValue: number;
  releasedValue: number;
  /** Fim da vigência, yyyy-mm-dd. */
  validUntil?: string;
  /** V. Situação da prestação de contas. */
  accountability: {
    status: AccountabilityStatus;
    /** Data prevista para apresentação. */
    dueAt?: string;
    /** Data em que foi apresentada. */
    submittedAt?: string;
    /** Prazo para análise pelo órgão. */
    analysisDeadline?: string;
    /** Resultado conclusivo, quando houver. */
    result?: string;
  };
  /** VI. Equipe paga com recursos da parceria. */
  team: TeamMember[];
  documents: PublicDocument[];
  projectSlug?: string;
  illustrative?: boolean;
};

export type InstitutionalDocument = PublicDocument & { id: string; description: string };
