import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/data/projects";
import { site } from "@/data/site";
import { getPartnerships } from "@/data/transparency";
import { ProjectDetail } from "@/features/projects/ProjectDetail";
import { findProject } from "@/lib/projects";
import { shareMetadata } from "../../metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = findProject(await getProjects(), (await params).slug);
  if (!project) return {};
  return shareMetadata({
    title: project.title,
    description: project.summary,
    path: `/projetos/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [projects, partnerships] = await Promise.all([getProjects(), getPartnerships()]);
  const project = findProject(projects, slug);
  if (!project) notFound();
  const partnership = partnerships.find((p) => p.id === project.partnershipId);
  return (
    <ProjectDetail
      project={project}
      partnership={partnership}
      showIllustrative={site.illustrativeContent}
    />
  );
}
