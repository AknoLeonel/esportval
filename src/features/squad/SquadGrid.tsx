"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { duration, ease, reveal } from "@/lib/motion";
import type { Player, Position, StaffMember } from "@/lib/types";

const FILTERS: ("Todos" | Position)[] = ["Todos", "Goleiro", "Fixo", "Ala", "Pivô"];

export function SquadGrid({ players, staff }: { players: Player[]; staff: StaffMember[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const visible = filter === "Todos" ? players : players.filter((p) => p.position === filter);

  return (
    <div>
      <fieldset className="mb-6 flex flex-wrap gap-2">
        <legend className="sr-only">Filtrar por posição</legend>
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full px-5 py-2 font-display text-lg font-bold tracking-wide uppercase ring-1 transition-[background-color,color,transform] duration-150 active:scale-[0.97]",
              filter === item
                ? "bg-brand text-ink-950 ring-brand"
                : "bg-ink-800 text-fg-muted ring-white/10 hover:text-fg",
            )}
          >
            {item === "Todos" ? item : `${item}s`}
          </button>
        ))}
      </fieldset>

      <p className="sr-only" aria-live="polite">
        {visible.length} atletas exibidos
      </p>

      <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((player) => (
            <motion.li
              key={player.id}
              layout
              variants={reveal}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ layout: { duration: duration.base, ease: ease.out } }}
              className="group relative overflow-hidden rounded-2xl bg-ink-800 p-5 ring-1 ring-white/10 transition-[background-color,box-shadow] duration-200 hover:bg-ink-700 hover:ring-brand/40"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 -right-1 font-display text-[7.5rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_var(--color-brand)] opacity-50 transition-opacity duration-200 group-hover:opacity-90"
              >
                {player.number}
              </span>
              <p className="relative mt-16 font-display text-3xl font-extrabold uppercase">
                {player.name}
              </p>
              <p className="relative text-sm tracking-widest text-brand uppercase">
                <span className="sr-only">Camisa {player.number}, </span>
                {player.position}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Reveal className="mt-10">
        <h3 className="mb-4 font-display text-sm font-bold tracking-[0.28em] text-fg-subtle uppercase">
          Comissão técnica
        </h3>
        <ul className="grid gap-3 sm:grid-cols-3">
          {staff.map((member) => (
            <li
              key={member.id}
              className="rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10"
            >
              <p className="font-display text-2xl font-bold uppercase">{member.name}</p>
              <p className="text-fg-muted">{member.role}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
