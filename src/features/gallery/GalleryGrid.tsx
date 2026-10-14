"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/ui/LazyImage";
import { Reveal } from "@/components/ui/Reveal";
import { duration, ease, reveal } from "@/lib/motion";
import type { GalleryItem } from "@/lib/types";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const isOpen = openIndex !== null;
  const reduce = useReducedMotion();
  // O portal só existe no navegador; evita divergência na hidratação.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpenIndex(null);
    trigger.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, step]);

  const current = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal as="li" key={item.id} index={index}>
            <button
              type="button"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setOpenIndex(index);
              }}
              aria-label={`Ampliar: ${item.caption}`}
              className="group relative block w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition-[transform,box-shadow] duration-200 hover:ring-brand/50 active:scale-[0.985]"
            >
              <LazyImage
                src={item.src}
                alt={item.alt}
                width={1200}
                height={800}
                unoptimized
                sizes="(min-width: 768px) 33vw, 50vw"
                wrapperClassName="aspect-[3/2]"
                className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-3 pt-10 text-left font-display text-xl font-bold tracking-wide uppercase">
                {item.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                key="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={`Galeria: ${current.caption}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className="fixed inset-0 z-[70] grid place-items-center bg-ink-950/90 p-4 backdrop-blur-sm"
                onClick={close}
              >
                <motion.figure
                  key={current.id}
                  variants={reveal}
                  custom={{ reduced: !!reduce }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-4xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <LazyImage
                    src={current.src}
                    alt={current.alt}
                    width={1200}
                    height={800}
                    unoptimized
                    eager
                    wrapperClassName="rounded-3xl ring-1 ring-white/10"
                    className="h-auto w-full"
                  />
                  <figcaption className="mt-4 text-center font-display text-2xl font-bold tracking-wide uppercase">
                    {current.caption}
                    <span className="ml-3 text-base text-fg-subtle tabular-nums">
                      {(openIndex ?? 0) + 1}/{items.length}
                    </span>
                  </figcaption>
                </motion.figure>

                <button
                  ref={closeButton}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    close();
                  }}
                  aria-label="Fechar"
                  className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-ink-800 text-2xl ring-1 ring-white/10 transition-[transform,background-color] duration-150 hover:bg-ink-600 active:scale-[0.95]"
                >
                  ×
                </button>
                {(["prev", "next"] as const).map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      step(direction === "next" ? 1 : -1);
                    }}
                    aria-label={direction === "next" ? "Próxima foto" : "Foto anterior"}
                    className={`absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-ink-800 text-2xl ring-1 ring-white/10 transition-[transform,background-color] duration-150 hover:bg-ink-600 active:scale-[0.95] ${direction === "next" ? "right-4" : "left-4"}`}
                  >
                    {direction === "next" ? "›" : "‹"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
