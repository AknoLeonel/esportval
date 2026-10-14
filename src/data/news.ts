import type { NewsItem } from "@/lib/types";

/** Notícias ilustrativas. */
const news: NewsItem[] = [
  {
    id: "n1",
    title: "Goleada em casa: 5 a 2 e liderança ao alcance",
    excerpt:
      "Com o ginásio cheio, o time controlou o ritmo desde o primeiro tempo e abriu vantagem na tabela.",
    date: "2026-10-11",
    category: "Resultado",
  },
  {
    id: "n2",
    title: "Peneira aberta: venha mostrar seu futsal",
    excerpt:
      "Atletas de todas as categorias podem se inscrever. Preencha o formulário e a comissão técnica entra em contato.",
    date: "2026-10-08",
    category: "Projeto",
  },
  {
    id: "n3",
    title: "Treino aberto no sábado: traga a família",
    excerpt:
      "Um treino para conhecer a rotina do projeto, a comissão e os valores que guiam o time dentro e fora da quadra.",
    date: "2026-10-05",
    category: "Comunidade",
  },
];

export async function getNews(): Promise<NewsItem[]> {
  return news;
}
