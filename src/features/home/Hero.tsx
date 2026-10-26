import { Suspense } from "react";
import { Mark } from "@/components/brand/Mark";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";
import { getProjects } from "@/data/projects";
import { site } from "@/data/site";
import { getPartnerships } from "@/data/transparency";
import { projectStats } from "@/lib/projects";
import { CourtLines } from "./CourtLines";

function ImpactSkeleton() {
  return (
    <SkeletonRegion label="Carregando números dos projetos">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {["projetos", "pessoas", "modalidades", "parcerias"].map((key) => (
          <Skeleton key={key} className="h-28 rounded-2xl" />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export async function Impact() {
  const [projects, partnerships] = await Promise.all([getProjects(), getPartnerships()]);
  const stats = projectStats(projects);
  const items = [
    { label: "Projetos realizados", value: stats.projects },
    { label: "Pessoas atendidas", value: stats.beneficiaries },
    { label: "Modalidades", value: stats.modalities },
    { label: "Parcerias publicadas", value: partnerships.length },
  ];

  return (
    <Reveal on="mount" index={4}>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col-reverse rounded-2xl bg-white/[0.04] px-5 py-5 ring-1 ring-white/10"
          >
            <dt className="mt-1 text-sm text-fg-muted">{item.label}</dt>
            <dd className="font-display text-5xl leading-none font-extrabold text-fg">
              <CountUp value={item.value} />
            </dd>
          </div>
        ))}
      </dl>
      {site.illustrativeContent && (
        <p className="mt-3 text-sm text-fg-subtle">
          Números calculados a partir dos projetos de exemplo.
        </p>
      )}
    </Reveal>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-24"
    >
      <CourtLines className="absolute inset-0 -z-10 size-full text-white/[0.06] [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_75%)]" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 -z-10 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_19/0.2),transparent)]"
      />
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <Reveal on="mount">
              <p className="mb-5 flex items-center gap-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
                <span aria-hidden="true" className="h-px w-8 bg-brand" />
                Associação {site.name}
              </p>
            </Reveal>
            <Reveal on="mount" index={1}>
              <h1
                id="hero-title"
                className="font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.92] font-extrabold tracking-tight uppercase"
              >
                Projetos esportivos <span className="block text-brand">com as contas abertas.</span>
              </h1>
            </Reveal>
            <Reveal on="mount" index={2}>
              <p className="mt-6 max-w-xl text-lg text-fg-muted sm:text-xl">{site.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/projetos">Ver projetos</ButtonLink>
                <ButtonLink href="/transparencia" variant="secondary">
                  Prestação de contas
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <Reveal on="mount" index={3} className="hidden justify-center lg:flex">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_19/0.35),transparent)] scale-125"
              />
              <Mark className="relative size-72 drop-shadow-[0_24px_48px_rgb(0_0_0/0.5)]" />
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <Suspense fallback={<ImpactSkeleton />}>
            <Impact />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
