import { Suspense } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/data/site";
import { getStandings } from "@/data/standings";
import { cn } from "@/lib/cn";
import { buildStandings } from "@/lib/standings";
import { StandingsSkeleton } from "./StandingsSkeleton";

export async function StandingsTable() {
  const rows = buildStandings(await getStandings());

  return (
    <Reveal>
      {/* tabIndex permite rolar a tabela com o teclado em telas estreitas */}
      <section
        aria-label="Tabela de classificação"
        tabIndex={0}
        className="overflow-x-auto rounded-[var(--radius-card)] bg-ink-800 ring-1 ring-white/10"
      >
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">Classificação da liga, ordenada por pontos</caption>
          <thead>
            <tr className="border-b border-white/10 text-sm tracking-widest text-fg-subtle uppercase">
              <th scope="col" className="w-12 py-4 pl-5 font-semibold">
                #
              </th>
              <th scope="col" className="py-4 font-semibold">
                Equipe
              </th>
              <th scope="col" className="px-3 py-4 text-center font-semibold text-fg">
                Pts
              </th>
              <th scope="col" className="px-3 py-4 text-center font-semibold">
                J
              </th>
              <th scope="col" className="px-3 py-4 text-center font-semibold">
                V
              </th>
              <th scope="col" className="hidden px-3 py-4 text-center font-semibold sm:table-cell">
                E
              </th>
              <th scope="col" className="hidden px-3 py-4 text-center font-semibold sm:table-cell">
                D
              </th>
              <th scope="col" className="px-3 py-4 text-center font-semibold">
                SG
              </th>
              <th scope="col" className="hidden w-40 py-4 pr-5 font-semibold md:table-cell">
                Aproveitamento
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.team}
                aria-current={row.isUs ? "true" : undefined}
                className={cn(
                  "border-b border-white/5 font-display text-xl last:border-0",
                  row.isUs ? "bg-brand/10" : "hover:bg-white/[0.03]",
                )}
              >
                <td
                  className={cn(
                    "py-3.5 pl-5 font-bold tabular-nums",
                    row.isUs ? "border-l-4 border-brand pl-4 text-brand" : "text-fg-muted",
                  )}
                >
                  {row.position}
                </td>
                <th scope="row" className="py-3.5 font-bold uppercase">
                  {row.team}
                </th>
                <td className="px-3 py-3.5 text-center font-extrabold tabular-nums">
                  {row.points}
                </td>
                <td className="px-3 py-3.5 text-center text-fg-muted tabular-nums">{row.played}</td>
                <td className="px-3 py-3.5 text-center text-fg-muted tabular-nums">{row.won}</td>
                <td className="hidden px-3 py-3.5 text-center text-fg-muted tabular-nums sm:table-cell">
                  {row.drawn}
                </td>
                <td className="hidden px-3 py-3.5 text-center text-fg-muted tabular-nums sm:table-cell">
                  {row.lost}
                </td>
                <td className="px-3 py-3.5 text-center text-fg-muted tabular-nums">
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </td>
                <td className="hidden py-3.5 pr-5 md:table-cell">
                  <ProgressBar value={row.performance} label={`Aproveitamento do ${row.team}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Reveal>
  );
}

export function StandingsSection() {
  return (
    <Section
      id="classificacao"
      eyebrow="Tabela"
      title="Classificação"
      description="Pontos, vitórias e saldo de gols da liga. Vitória vale 3 pontos, empate vale 1."
      illustrative={site.illustrativeContent}
      className="bg-ink-900"
    >
      <Suspense fallback={<StandingsSkeleton />}>
        <StandingsTable />
      </Suspense>
    </Section>
  );
}
