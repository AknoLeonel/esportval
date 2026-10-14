import { Suspense } from "react";
import { LazyOnView } from "@/components/ui/LazyOnView";
import { Section } from "@/components/ui/Section";
import { getGallery } from "@/data/gallery";
import { site } from "@/data/site";
import { GalleryGrid } from "./GalleryGrid";
import { GallerySkeleton } from "./GallerySkeleton";

export async function GalleryContent() {
  const items = await getGallery();
  return (
    <LazyOnView fallback={<GallerySkeleton />}>
      <GalleryGrid items={items} />
    </LazyOnView>
  );
}

export function GallerySection() {
  return (
    <Section
      id="galeria"
      eyebrow="Imagens"
      title="Galeria"
      description="Momentos de treino e de jogo. Toque em uma imagem para ampliar."
      illustrative={site.illustrativeContent}
    >
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent />
      </Suspense>
    </Section>
  );
}
