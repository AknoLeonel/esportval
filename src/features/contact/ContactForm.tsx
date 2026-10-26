"use client";

import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import {
  AGE_CATEGORIES,
  type ContactInput,
  contactSchema,
  type FieldErrors,
  fieldErrors,
} from "@/lib/contact-schema";
import { duration, ease, reveal } from "@/lib/motion";
import { reportError, trackEvent } from "@/lib/observability";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl bg-ink-950 px-4 py-3 text-fg ring-1 ring-white/15 transition-[box-shadow,background-color] duration-150 placeholder:text-fg-subtle hover:ring-white/30 focus:ring-2 focus:ring-brand focus:outline-none aria-[invalid=true]:ring-loss";

export function ContactForm({ instagramUrl }: { instagramUrl: string }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = new FormData(event.currentTarget);
    const raw = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      category: form.get("category"),
      message: form.get("message") || undefined,
      consent: form.get("consent") === "on",
      website: form.get("website") || undefined,
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const found = fieldErrors(parsed.error);
      setErrors(found);
      setStatus("idle");
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies ContactInput),
      });
      if (response.status === 422) {
        const body = (await response.json()) as { errors?: FieldErrors };
        setErrors(body.errors ?? {});
        setStatus("idle");
        return;
      }
      if (!response.ok) throw new Error(`contato: HTTP ${response.status}`);
      trackEvent("contact_submitted", { category: parsed.data.category });
      setStatus("success");
    } catch (failure) {
      reportError(failure, { feature: "contact-form" });
      setStatus("error");
    }
  }

  const describe = (field: keyof ContactInput) =>
    errors[field] ? `${uid}-${field}-error` : undefined;
  const invalid = (field: keyof ContactInput) => (errors[field] ? true : undefined);
  const fieldError = (field: keyof ContactInput) =>
    errors[field] && (
      <p id={`${uid}-${field}-error`} className="mt-1.5 text-sm text-loss">
        {errors[field]}
      </p>
    );

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink-800 shadow-[var(--shadow-card)] ring-1 ring-white/10">
      {/* Progresso indeterminado enquanto o envio acontece. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 overflow-hidden">
        {status === "submitting" && (
          <div className="h-full w-2/5 animate-indeterminate bg-brand will-change-transform" />
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            variants={reveal}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-8 text-center sm:p-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: duration.enter, ease: ease.out, delay: 0.1 }}
              className="mx-auto grid size-16 place-items-center rounded-full bg-brand text-3xl text-ink-950"
              aria-hidden="true"
            >
              ✓
            </motion.div>
            <h3 className="mt-6 font-display text-4xl font-extrabold uppercase">
              Recebemos seu contato!
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-fg-muted">
              A comissão técnica vai responder em breve. Enquanto isso, acompanhe os bastidores no
              Instagram.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-display text-xl font-bold tracking-wide text-brand uppercase underline-offset-4 hover:underline"
            >
              Ver o Instagram
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            variants={reveal}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-busy={status === "submitting"}
            className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
          >
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-name`} className="mb-1.5 block font-semibold">
                Nome completo
              </label>
              <input
                id={`${uid}-name`}
                name="name"
                autoComplete="name"
                className={inputClass}
                aria-invalid={invalid("name")}
                aria-describedby={describe("name")}
              />
              {fieldError("name")}
            </div>

            <div>
              <label htmlFor={`${uid}-email`} className="mb-1.5 block font-semibold">
                E-mail
              </label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                autoComplete="email"
                className={inputClass}
                aria-invalid={invalid("email")}
                aria-describedby={describe("email")}
              />
              {fieldError("email")}
            </div>

            <div>
              <label htmlFor={`${uid}-phone`} className="mb-1.5 block font-semibold">
                WhatsApp / telefone
              </label>
              <input
                id={`${uid}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(61) 90000-0000"
                className={inputClass}
                aria-invalid={invalid("phone")}
                aria-describedby={describe("phone")}
              />
              {fieldError("phone")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-category`} className="mb-1.5 block font-semibold">
                Categoria do atleta
              </label>
              <select
                id={`${uid}-category`}
                name="category"
                defaultValue=""
                className={inputClass}
                aria-invalid={invalid("category")}
                aria-describedby={describe("category")}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {AGE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {fieldError("category")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-message`} className="mb-1.5 block font-semibold">
                Mensagem <span className="font-normal text-fg-subtle">(opcional)</span>
              </label>
              <textarea
                id={`${uid}-message`}
                name="message"
                rows={4}
                className={cn(inputClass, "resize-y")}
                aria-invalid={invalid("message")}
                aria-describedby={describe("message")}
              />
              {fieldError("message")}
            </div>

            {/* Honeypot: invisível para pessoas, tentador para robôs. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Não preencha
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 text-fg-muted">
                <input
                  type="checkbox"
                  name="consent"
                  className="mt-1 size-5 shrink-0 accent-[var(--color-brand)]"
                  aria-invalid={invalid("consent")}
                  aria-describedby={describe("consent")}
                />
                <span>
                  Concordo em receber o retorno do Esportval por e-mail ou WhatsApp. Usaremos seus
                  dados só para essa conversa.
                </span>
              </label>
              {fieldError("consent")}
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl bg-loss/10 p-4 text-loss ring-1 ring-loss/30 sm:col-span-2"
              >
                Não conseguimos enviar agora. Tente de novo em instantes ou chame a gente direto no{" "}
                <a
                  className="font-semibold underline"
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                .
              </p>
            )}

            <div className="sm:col-span-2">
              <Button type="submit" disabled={status === "submitting"} className="min-w-48">
                {status === "submitting" ? (
                  <>
                    <Spinner /> Enviando…
                  </>
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
