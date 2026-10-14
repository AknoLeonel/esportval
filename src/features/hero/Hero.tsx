import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { getMatches } from "@/data/matches";
import { site } from "@/data/site";
import { formatMatchDate, splitMatches, summarize } from "@/lib/matches";
import { CourtLines } from "./CourtLines";
import { HeroPanelSkeleton } from "./HeroSkeleton";

export async function HeroPanel() {
  const matches = await getMatches();
  const { upcoming } = splitMatches(matches);
  const next = upcoming[0];
  const summary = summarize(matches);
  const points = summary.won * 3 + summary.drawn;
  const performance = summary.played ? Math.round((points / (summary.played * 3)) * 100) : 0;
  const when = next ? formatMatchDate(next.date) : null;

  const stats = [
    { label: "Jogos", value: summary.played, suffix: "" },
    { label: "Vitórias", value: summary.won, suffix: "" },
    { label: "Gols marcados", value: summary.goalsFor, suffix: "" },
    { label: "Aproveitamento", value: performance, suffix: "%" },
  ];

  return (
    <>
      {next && when && (
        <Reveal on="mount" index={3}>
          <article
            aria-label="Próximo jogo"
            className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink-800 p-6 shadow-[var(--shadow-card)] ring-1 ring-white/10 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-64 rounded-full bg-brand/20 blur-3xl"
            />
            <p className="relative flex items-center gap-2 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
              </span>
              Próximo jogo
            </p>
            <p className="relative mt-5 font-display text-7xl leading-none font-extrabold tracking-tight uppercase sm:text-8xl">
              {when.day}
              <span className="ml-3 text-3xl text-fg-muted sm:text-4xl">{when.month}</span>
            </p>
            <p className="relative mt-1 font-display text-xl font-semibold tracking-wide text-fg-muted uppercase">
              {when.weekday} · {when.time}
            </p>
            <p className="relative mt-6 font-display text-3xl leading-tight font-bold uppercase sm:text-4xl">
              {next.home ? `Esportval × ${next.opponent}` : `${next.opponent} × Esportval`}
            </p>
            <p className="relative mt-2 text-fg-muted">
              {next.venue} · {next.competition}
            </p>
          </article>
        </Reveal>
      )}

      <Reveal on="mount" index={5}>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse rounded-2xl bg-white/[0.04] px-4 py-4 ring-1 ring-white/10"
            >
              <dt className="mt-1 text-sm text-fg-muted">{stat.label}</dt>
              <dd className="font-display text-5xl leading-none font-extrabold text-fg">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-20 sm:pb-28"
    >
      <CourtLines className="absolute inset-0 -z-10 size-full text-white/[0.06] [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_75%)]" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 -z-10 size-[34rem] rounded-full bg-brand/15 blur-[120px]"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div>
          <Reveal on="mount">
            <p className="mb-5 flex items-center gap-3 font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              Projeto Futsal · {site.crestName}
            </p>
          </Reveal>
          <Reveal on="mount" index={1}>
            <h1
              id="hero-title"
              className="font-display text-[clamp(3rem,8.4vw,6.25rem)] leading-[0.9] font-extrabold tracking-tight uppercase"
            >
              Oportunidades não surgem.{" "}
              <span className="block text-brand">É você que as cria.</span>
            </h1>
          </Reveal>
          <Reveal on="mount" index={2}>
            <p className="mt-6 max-w-xl text-lg text-fg-muted sm:text-xl">
              Acompanhe os jogos, a classificação e o elenco do Esportval Futsal — e venha treinar
              com a gente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#contato">Quero treinar</ButtonLink>
              <ButtonLink href={site.instagram.url} external variant="secondary">
                Seguir no Instagram
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div>
          <Suspense fallback={<HeroPanelSkeleton />}>
            <HeroPanel />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
