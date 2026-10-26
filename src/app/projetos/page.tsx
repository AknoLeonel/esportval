import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { getProjects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectsExplorer } from "@/features/projects/ProjectsExplorer";
import { ProjectsSkeleton } from "@/features/projects/ProjectsSkeleton";
import { shareMetadata } from "../metadata";

export const metadata: Metadata = shareMetadata({
  title: "Projetos",
  description: "Projetos esportivos realizados e em andamento pela Esportval.",
  path: "/projetos",
});

async function ProjectsList() {
  return (
    <ProjectsExplorer projects={await getProjects()} showIllustrative={site.illustrativeContent} />
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-[calc(var(--header-h)+3rem)] pb-20 sm:px-8">
      <Reveal on="mount" as="header" className="mb-10 max-w-2xl">
        <p className="mb-3 flex items-center gap-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-brand" />O que fazemos
        </p>
        <h1 className="font-display text-5xl leading-none font-extrabold tracking-tight uppercase sm:text-7xl">
          Projetos
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Os projetos da {site.name}: quem atendem, onde acontecem, o que entregaram e quem
          financiou.
        </p>
      </Reveal>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
