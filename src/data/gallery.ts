import type { GalleryItem } from "@/lib/types";

/**
 * Ilustrações de quadra geradas como substitutas. Troque por fotos reais do clube em /public/gallery
 * (mantenha a proporção 3:2) e ajuste as legendas.
 */
const gallery: GalleryItem[] = [
  {
    id: "g1",
    src: "/gallery/quadra-1.svg",
    alt: "Ilustração de quadra de futsal em laranja",
    caption: "Dia de jogo",
  },
  {
    id: "g2",
    src: "/gallery/quadra-2.svg",
    alt: "Ilustração de bola e traves em tons de grafite",
    caption: "Treino técnico",
  },
  {
    id: "g3",
    src: "/gallery/quadra-3.svg",
    alt: "Ilustração do círculo central da quadra",
    caption: "Saída de bola",
  },
  {
    id: "g4",
    src: "/gallery/quadra-4.svg",
    alt: "Ilustração de área de pênalti com marcações brancas",
    caption: "Jogada ensaiada",
  },
  {
    id: "g5",
    src: "/gallery/quadra-5.svg",
    alt: "Ilustração de bola em movimento sobre a quadra",
    caption: "Finalização",
  },
  {
    id: "g6",
    src: "/gallery/quadra-6.svg",
    alt: "Ilustração de quadra em perspectiva",
    caption: "Equipe em quadra",
  },
];

export async function getGallery(): Promise<GalleryItem[]> {
  return gallery;
}
