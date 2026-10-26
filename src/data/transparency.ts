import type { InstitutionalDocument, Partnership } from "@/lib/types";

/**
 * Parcerias com a administração pública (Lei 13.019/2014, art. 11).
 *
 * ATENÇÃO: os registros abaixo são EXEMPLOS de formato (`illustrative: true`, instrumento "nº 000").
 * Antes de divulgar o site, troque pelas parcerias reais e coloque os PDFs em /public/documentos.
 * Documento sem `href` aparece como "em publicação".
 */
const partnerships: Partnership[] = [
  {
    id: "p-2026-01",
    instrument: "Termo de Fomento nº 000/2026",
    agency: "Órgão público concedente (exemplo)",
    signedAt: "2026-02-10",
    object:
      "Execução do projeto Corrida e Saúde: treinos orientados e avaliação física de adultos e pessoas idosas.",
    totalValue: 60000,
    releasedValue: 20000,
    validUntil: "2027-01-31",
    accountability: { status: "em-execucao", dueAt: "2027-03-31" },
    team: [
      { role: "Coordenação do projeto", monthlyPay: 2500, months: 12 },
      { role: "Profissional de educação física", monthlyPay: 2000, months: 12 },
    ],
    documents: [{ title: "Plano de trabalho" }, { title: "Termo de fomento assinado" }],
    projectSlug: "corrida-e-saude",
    illustrative: true,
  },
  {
    id: "p-2025-01",
    instrument: "Termo de Fomento nº 000/2025",
    agency: "Órgão público concedente (exemplo)",
    signedAt: "2025-05-12",
    object:
      "Realização do Festival Multiesportes com estações de futsal, vôlei, basquete e atletismo.",
    totalValue: 85000,
    releasedValue: 85000,
    validUntil: "2025-08-31",
    accountability: {
      status: "em-analise",
      dueAt: "2025-09-30",
      submittedAt: "2025-09-22",
      analysisDeadline: "2026-03-21",
    },
    team: [
      { role: "Coordenação geral", monthlyPay: 3500, months: 3 },
      { role: "Monitores esportivos", monthlyPay: 1800, months: 1, people: 8 },
    ],
    documents: [
      { title: "Plano de trabalho" },
      { title: "Termo de fomento assinado" },
      { title: "Relatório de execução do objeto" },
      { title: "Relatório de execução financeira" },
    ],
    projectSlug: "festival-multiesportes",
    illustrative: true,
  },
  {
    id: "p-2024-01",
    instrument: "Termo de Colaboração nº 000/2024",
    agency: "Órgão público concedente (exemplo)",
    signedAt: "2024-07-15",
    object: "Aulas de iniciação ao vôlei para jovens de 12 a 18 anos, com torneio de encerramento.",
    totalValue: 48000,
    releasedValue: 48000,
    validUntil: "2024-12-31",
    accountability: {
      status: "aprovada",
      dueAt: "2025-02-28",
      submittedAt: "2025-02-20",
      analysisDeadline: "2025-08-19",
      result: "Contas aprovadas sem ressalvas.",
    },
    team: [{ role: "Professor de vôlei", monthlyPay: 2200, months: 5 }],
    documents: [
      { title: "Plano de trabalho" },
      { title: "Termo de colaboração assinado" },
      { title: "Prestação de contas final" },
      { title: "Parecer conclusivo do órgão" },
    ],
    projectSlug: "volei-na-comunidade",
    illustrative: true,
  },
];

/** Documentos que toda associação deve manter públicos. Sem `href` = ainda não publicado. */
const institutionalDocuments: InstitutionalDocument[] = [
  {
    id: "estatuto",
    title: "Estatuto social",
    description: "Regras de funcionamento da associação, registrado em cartório.",
  },
  {
    id: "ata-diretoria",
    title: "Ata de eleição da diretoria",
    description: "Composição e mandato da diretoria atual.",
  },
  {
    id: "cnpj",
    title: "Comprovante de inscrição no CNPJ",
    description: "Cartão CNPJ emitido pela Receita Federal.",
  },
  {
    id: "certidoes",
    title: "Certidões de regularidade",
    description: "Certidões negativas de débitos federais, FGTS e trabalhistas.",
  },
  {
    id: "demonstracoes",
    title: "Demonstrações contábeis",
    description: "Balanço patrimonial e demonstração do resultado de cada exercício.",
  },
  {
    id: "relatorio-anual",
    title: "Relatório anual de atividades",
    description: "O que foi feito no ano e para quem.",
  },
];

export async function getPartnerships(): Promise<Partnership[]> {
  return partnerships;
}

export async function getInstitutionalDocuments(): Promise<InstitutionalDocument[]> {
  return institutionalDocuments;
}
