import { Suspense } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";
import { getProjects } from "@/data/projects";
import { site } from "@/data/site";
import { sortProjects } from "@/lib/projects";

const FEATURED = 3;

function FeaturedSkeleton() {
  return (
    <SkeletonRegion label="Carregando projetos">
      <div className="grid gap-4 md:grid-cols-3">
        {["a", "b", "c"].map((key) => (
          <Skeleton key={key} className="h-[26rem] rounded-[var(--radius-card)]" />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export async function FeaturedList() {
  const projects = sortProjects(await getProjects()).slice(0, FEATURED);
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {projects.map((project, index) => (
        <Reveal as="li" key={project.slug} index={index}>
          <ProjectCard project={project} showIllustrative={site.illustrativeContent} />
        </Reveal>
      ))}
    </ul>
  );
}

export function FeaturedProjects() {
  return (
    <Section
      id="projetos"
      eyebrow="O que fazemos"
      title="Projetos"
      description="Cada projeto tem página própria com objetivo, público atendido, resultados e quem financiou."
    >
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedList />
      </Suspense>
      <Reveal className="mt-10">
        <ButtonLink href="/projetos" variant="secondary">
          Todos os projetos
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
