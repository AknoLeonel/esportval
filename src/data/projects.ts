import type { MediaItem, Project } from "@/lib/types";

/** Capa e galeria geradas como ilustração. Troque por fotos reais em /public/projetos (proporção 3:2). */
const art = (slug: string, n: number, caption: string, alt: string): MediaItem => ({
  id: `${slug}-${n}`,
  src: `/projetos/${slug}-${n}.svg`,
  alt,
  caption,
});

/**
 * Projetos da associação. Os registros marcados com `illustrative` são EXEMPLOS de formato:
 * substitua pelos projetos reais (e apague os exemplos) antes de divulgar o site.
 */
const projects: Project[] = [
  {
    slug: "projeto-futsal-fut-art",
    title: "Projeto Futsal Fut’Art",
    summary:
      "Treinos de futsal para crianças e adolescentes, com acompanhamento escolar e formação cidadã.",
    description: [
      "O Projeto Futsal Fut’Art usa o esporte como porta de entrada para disciplina, convivência e permanência na escola.",
      "As turmas treinam no contraturno escolar, com professores de educação física e acompanhamento da frequência escolar dos atletas.",
    ],
    modalities: ["Futsal"],
    status: "em-andamento",
    period: { start: "2025-03" },
    location: "Ginásio comunitário",
    audience: "Crianças e adolescentes de 8 a 17 anos",
    beneficiaries: 120,
    results: [
      "4 turmas por semana",
      "Participação em campeonatos regionais",
      "Acompanhamento da frequência escolar",
    ],
    cover: art(
      "projeto-futsal-fut-art",
      1,
      "Treino em quadra",
      "Ilustração de quadra de futsal em laranja",
    ),
    gallery: [
      art("projeto-futsal-fut-art", 2, "Aquecimento", "Ilustração de bola sobre a quadra"),
      art("projeto-futsal-fut-art", 3, "Dia de jogo", "Ilustração do círculo central da quadra"),
    ],
    funding: "Recursos próprios e apoiadores",
    illustrative: true,
  },
  {
    slug: "festival-multiesportes",
    title: "Festival Multiesportes",
    summary: "Um dia de vivências em futsal, vôlei, basquete e atletismo aberto à comunidade.",
    description: [
      "O festival reuniu famílias da comunidade para experimentar diferentes modalidades em estações orientadas por profissionais.",
    ],
    modalities: ["Multiesportes", "Basquete", "Atletismo"],
    status: "concluido",
    period: { start: "2025-07", end: "2025-07" },
    location: "Praça de esportes da comunidade",
    audience: "Comunidade em geral",
    beneficiaries: 300,
    results: ["8 estações esportivas", "300 participantes", "Kits esportivos distribuídos"],
    cover: art(
      "festival-multiesportes",
      1,
      "Estações esportivas",
      "Ilustração de bola multiesportiva",
    ),
    gallery: [art("festival-multiesportes", 2, "Basquete", "Ilustração de quadra de basquete")],
    funding: "Termo de fomento com o poder público",
    partnershipId: "p-2025-01",
    illustrative: true,
  },
  {
    slug: "volei-na-comunidade",
    title: "Vôlei na Comunidade",
    summary: "Aulas gratuitas de vôlei para jovens, com torneio de encerramento.",
    description: [
      "Turmas de iniciação ao vôlei com encontros semanais e um torneio entre as turmas no fim do ciclo.",
    ],
    modalities: ["Vôlei"],
    status: "concluido",
    period: { start: "2024-08", end: "2024-12" },
    location: "Quadra poliesportiva",
    audience: "Jovens de 12 a 18 anos",
    beneficiaries: 80,
    results: ["2 turmas", "Torneio de encerramento", "Material esportivo para a quadra"],
    cover: art("volei-na-comunidade", 1, "Rede e quadra", "Ilustração de rede de vôlei"),
    gallery: [art("volei-na-comunidade", 2, "Torneio", "Ilustração de bola de vôlei")],
    funding: "Termo de colaboração com o poder público",
    partnershipId: "p-2024-01",
    illustrative: true,
  },
  {
    slug: "corrida-e-saude",
    title: "Corrida e Saúde",
    summary: "Grupo de corrida orientada para adultos e pessoas idosas.",
    description: [
      "Treinos orientados de caminhada e corrida, com avaliação física no início e no fim de cada ciclo.",
    ],
    modalities: ["Atletismo"],
    status: "em-andamento",
    period: { start: "2026-02" },
    location: "Parque da cidade",
    audience: "Adultos e pessoas idosas",
    beneficiaries: 60,
    results: ["3 treinos por semana", "Avaliação física por ciclo"],
    cover: art("corrida-e-saude", 1, "Pista", "Ilustração de pista de atletismo"),
    gallery: [],
    funding: "Termo de fomento com o poder público",
    partnershipId: "p-2026-01",
    illustrative: true,
  },
];

/** Camada assíncrona (CMS/API no futuro): as páginas já usam Suspense + skeleton. */
export async function getProjects(): Promise<Project[]> {
  return projects;
}
