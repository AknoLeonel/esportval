import type { Metadata } from "next";
import { site } from "@/data/site";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.headline}`,
};

/**
 * Metadados de compartilhamento de uma página. O Next SUBSTITUI o `openGraph`/`twitter` do layout
 * quando a página define o seu (não mescla), então imagem, nome do site e idioma vão sempre juntos.
 */
export function shareMetadata(page: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.name,
      url: page.path,
      title: page.title,
      description: page.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [OG_IMAGE.url],
    },
  };
}
