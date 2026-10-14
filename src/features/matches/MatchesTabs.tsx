"use client";

import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/motion";
import type { Match } from "@/lib/types";
import { MatchCard } from "./MatchCard";

type TabKey = "upcoming" | "results";

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Próximos jogos" },
  { key: "results", label: "Resultados" },
];

const EMPTY: Record<TabKey, string> = {
  upcoming: "Nenhum jogo agendado por enquanto.",
  results: "Ainda não há resultados.",
};

export function MatchesTabs({ upcoming, results }: { upcoming: Match[]; results: Match[] }) {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const uid = useId();
  const refs = useRef<Record<TabKey, HTMLButtonElement | null>>({ upcoming: null, results: null });
  const list = tab === "upcoming" ? upcoming : results;
  const empty = EMPTY[tab];

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const next: TabKey = tab === "upcoming" ? "results" : "upcoming";
    setTab(next);
    refs.current[next]?.focus();
    event.preventDefault();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Jogos"
        onKeyDown={onKeyDown}
        className="mb-6 inline-flex rounded-full bg-ink-800 p-1 ring-1 ring-white/10"
      >
        {TABS.map((item) => (
          <button
            key={item.key}
            ref={(node) => {
              refs.current[item.key] = node;
            }}
            type="button"
            role="tab"
            id={`${uid}-${item.key}-tab`}
            aria-selected={tab === item.key}
            aria-controls={`${uid}-panel`}
            tabIndex={tab === item.key ? 0 : -1}
            onClick={() => setTab(item.key)}
            className={cn(
              "rounded-full px-5 py-2 font-display text-lg font-bold tracking-wide uppercase transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
              tab === item.key ? "bg-brand text-ink-950" : "text-fg-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${tab}-tab`} tabIndex={0}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            variants={reveal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid gap-3"
          >
            {list.length === 0 && <p className="text-fg-muted">{empty}</p>}
            {list.map((match, index) => (
              <Reveal key={match.id} on="mount" index={index}>
                <MatchCard match={match} />
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
