"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { formatBRL, formatDate } from "@/lib/format";
import { filterItem, reveal } from "@/lib/motion";
import {
  ACCOUNTABILITY,
  filterPartnerships,
  type PartnershipFilter,
  partnershipYears,
  sortPartnerships,
} from "@/lib/transparency";
import type { AccountabilityStatus, Partnership } from "@/lib/types";
import { PartnershipDetails } from "./PartnershipDetails";

const field =
  "w-full rounded-xl bg-ink-950 px-4 py-3 text-fg ring-1 ring-white/15 transition-[box-shadow] duration-150 hover:ring-white/30 focus:ring-2 focus:ring-brand focus:outline-none";

type Props = { partnerships: Partnership[]; organization: string; showIllustrative: boolean };

export function PartnershipsExplorer({ partnerships, organization, showIllustrative }: Props) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Required<PartnershipFilter>>({
    year: "todos",
    status: "todas",
    query: "",
  });
  const [open, setOpen] = useState<string | null>(null);
  const years = useMemo(() => partnershipYears(partnerships), [partnerships]);
  const visible = useMemo(
    () => sortPartnerships(filterPartnerships(partnerships, filter)),
    [partnerships, filter],
  );

  // Link direto (/transparencia#p-2025-01): abre e rola até a parceria.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !partnerships.some((p) => p.id === id)) return;
    setOpen(id);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, [partnerships]);

  if (partnerships.length === 0) {
    return (
      <p className="rounded-2xl bg-ink-800 p-6 text-fg-muted ring-1 ring-white/10">
        Nenhuma parceria com o poder público até o momento. Quando houver, ela será publicada aqui
        desde a assinatura.
      </p>
    );
  }

  return (
    <div>
      <form
        role="search"
        aria-label="Filtrar parcerias"
        onSubmit={(event) => event.preventDefault()}
        className="mb-6 grid gap-3 sm:grid-cols-[1fr_10rem_14rem]"
      >
        <label className="grid gap-1 text-sm text-fg-subtle">
          Buscar
          <input
            type="search"
            value={filter.query}
            onChange={(event) => setFilter((f) => ({ ...f, query: event.target.value }))}
            placeholder="Instrumento, órgão ou objeto"
            className={field}
          />
        </label>
        <label className="grid gap-1 text-sm text-fg-subtle">
          Ano
          <select
            value={String(filter.year)}
            onChange={(event) =>
              setFilter((f) => ({
                ...f,
                year: event.target.value === "todos" ? "todos" : Number(event.target.value),
              }))
            }
            className={field}
          >
            <option value="todos">Todos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm text-fg-subtle">
          Situação das contas
          <select
            value={filter.status}
            onChange={(event) =>
              setFilter((f) => ({
                ...f,
                status: event.target.value as AccountabilityStatus | "todas",
              }))
            }
            className={field}
          >
            <option value="todas">Todas</option>
            {(Object.keys(ACCOUNTABILITY) as AccountabilityStatus[]).map((status) => (
              <option key={status} value={status}>
                {ACCOUNTABILITY[status].label}
              </option>
            ))}
          </select>
        </label>
      </form>

      <p className="mb-4 text-sm text-fg-subtle" aria-live="polite">
        {visible.length === 1 ? "1 parceria" : `${visible.length} parcerias`}
      </p>

      {visible.length === 0 && <p className="text-fg-muted">Nenhuma parceria com esses filtros.</p>}

      <ul className="grid gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((partnership) => {
            const isOpen = open === partnership.id;
            const status = ACCOUNTABILITY[partnership.accountability.status];
            const panelId = `${uid}-${partnership.id}`;
            return (
              <motion.li
                key={partnership.id}
                id={partnership.id}
                layout="position"
                variants={filterItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "scroll-mt-28 overflow-hidden rounded-[var(--radius-card)] bg-ink-800 ring-1 transition-[box-shadow] duration-200",
                  isOpen ? "ring-brand/40" : "ring-white/10",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : partnership.id)}
                    className="grid w-full gap-3 px-5 py-5 text-left transition-colors duration-150 hover:bg-white/[0.03] sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                  >
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <Badge tone={status.tone}>{status.label}</Badge>
                        {showIllustrative && partnership.illustrative && (
                          <Badge tone="warn">Exemplo</Badge>
                        )}
                        <span className="text-sm text-fg-subtle">
                          {formatDate(partnership.signedAt)}
                        </span>
                      </span>
                      <span className="mt-2 block font-display text-2xl font-bold uppercase">
                        {partnership.instrument}
                      </span>
                      <span className="mt-1 block text-fg-muted">{partnership.object}</span>
                    </span>
                    <span className="flex items-center gap-4 sm:justify-end">
                      <span className="font-display text-2xl font-extrabold tabular-nums">
                        {formatBRL(partnership.totalValue)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-9 place-items-center rounded-full bg-white/5 text-xl transition-transform duration-200",
                          isOpen && "rotate-45",
                        )}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="details"
                      id={panelId}
                      role="region"
                      aria-label={`Detalhes: ${partnership.instrument}`}
                      variants={reveal}
                      custom={{ reduced: !!reduce }}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <PartnershipDetails partnership={partnership} organization={organization} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
