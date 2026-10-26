"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { cn } from "@/lib/cn";
import { pop } from "@/lib/motion";

type NavItem = { href: string; label: string };

export function Header({ nav, cta }: { nav: readonly NavItem[]; cta: NavItem }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow] duration-300",
          scrolled || open
            ? "bg-ink-950/85 shadow-[0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#inicio" aria-label="Esportval Futsal — início" onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 font-display text-lg font-semibold tracking-wide text-fg-muted uppercase transition-colors duration-150 hover:bg-white/5 hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href={cta.href}
              className="ml-3 rounded-full bg-brand px-5 py-2 font-display text-lg font-bold tracking-wide text-ink-950 uppercase transition-[transform,background-color] duration-150 hover:bg-brand-400 active:scale-[0.97]"
            >
              {cta.label}
            </a>
          </nav>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full ring-1 ring-white/10 transition-[transform,background-color] duration-150 hover:bg-white/5 active:scale-[0.95] lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute inset-x-0 h-0.5 rounded bg-fg transition-transform duration-200",
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 h-0.5 rounded bg-fg transition-transform duration-200",
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="menu-mobile"
              aria-label="Menu móvel"
              variants={pop}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top right" }}
              className="absolute inset-x-3 top-[calc(var(--header-h)-0.25rem)] rounded-3xl bg-ink-800 p-3 shadow-[var(--shadow-card)] ring-1 ring-white/10 lg:hidden"
            >
              <ul className="grid gap-1">
                {[...nav, cta].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 font-display text-2xl font-bold tracking-wide uppercase transition-colors duration-150 hover:bg-white/5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
