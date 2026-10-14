import { cn } from "@/lib/cn";
import { formatMatchDate, type MatchResult, matchResult } from "@/lib/matches";
import type { Match } from "@/lib/types";

const RESULT_STYLE: Record<MatchResult, { label: string; className: string }> = {
  V: { label: "Vitória", className: "bg-win/15 text-win ring-win/30" },
  E: { label: "Empate", className: "bg-draw/15 text-draw ring-draw/30" },
  D: { label: "Derrota", className: "bg-loss/15 text-loss ring-loss/30" },
};

const US = "Esportval";

export function MatchCard({ match }: { match: Match }) {
  const when = formatMatchDate(match.date);
  const { score } = match;
  const result = score ? RESULT_STYLE[matchResult(score)] : null;
  const home = match.home ? US : match.opponent;
  const away = match.home ? match.opponent : US;
  const homeGoals = score ? (match.home ? score.for : score.against) : null;
  const awayGoals = score ? (match.home ? score.against : score.for) : null;

  return (
    <article
      aria-label={`${home} contra ${away}`}
      className="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl bg-ink-800 p-4 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-200 hover:bg-ink-700 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-6 sm:p-5"
    >
      <time
        dateTime={match.date}
        className="flex flex-col items-center rounded-xl bg-ink-950/60 py-2 text-center leading-none"
      >
        <span className="text-xs tracking-widest text-fg-muted uppercase">{when.weekday}</span>
        <span className="mt-1 font-display text-4xl font-extrabold">{when.day}</span>
        <span className="mt-0.5 text-xs tracking-widest text-brand uppercase">{when.month}</span>
      </time>

      <div className="min-w-0">
        <div className="flex items-center gap-3 font-display text-2xl font-bold uppercase sm:text-3xl">
          <span className={cn("truncate", match.home && "text-brand")}>{home}</span>
          {score ? (
            <span
              className="shrink-0 rounded-lg bg-ink-950 px-3 py-0.5 tabular-nums"
              aria-label={`${homeGoals} a ${awayGoals}`}
            >
              {homeGoals}–{awayGoals}
            </span>
          ) : (
            <span aria-hidden="true" className="shrink-0 text-fg-subtle">
              ×
            </span>
          )}
          <span className={cn("truncate", !match.home && "text-brand")}>{away}</span>
        </div>
        <p className="mt-1 truncate text-sm text-fg-muted">
          {match.venue} · {match.competition}
        </p>
      </div>

      <div className="col-span-2 flex justify-end sm:col-span-1">
        {result ? (
          <span
            className={cn(
              "rounded-full px-3 py-1 font-display text-sm font-bold tracking-widest uppercase ring-1",
              result.className,
            )}
          >
            {result.label}
          </span>
        ) : (
          <span className="rounded-full bg-white/5 px-3 py-1 font-display text-lg font-bold tabular-nums ring-1 ring-white/10">
            {when.time}
          </span>
        )}
      </div>
    </article>
  );
}
