import type { MetadataRoute } from "next";
import { getProjects } from "@/data/projects";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/transparencia`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/projetos`, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((project) => ({
      url: `${site.url}/projetos/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
