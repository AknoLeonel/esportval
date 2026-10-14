import { SpanStatusCode, trace } from "@opentelemetry/api";
import * as Sentry from "@sentry/nextjs";
import { listAdapters } from "./registry";
import { type EventProps, normalizeError, scrub } from "./scrub";

export type { EventProps } from "./scrub";

/**
 * Fachada única de observabilidade. O app chama só estas funções:
 * Sentry (erros), OpenTelemetry (traces), Datadog RUM e New Relic (navegador) recebem o mesmo dado.
 * Provedores sem chave ficam inativos sem lançar erro.
 */
function safely(label: string, task: () => void): void {
  try {
    task();
  } catch (failure) {
    // Observabilidade nunca pode derrubar o app.
    if (process.env.NODE_ENV !== "production") console.warn(`[observability:${label}]`, failure);
  }
}

export function reportError(error: unknown, context?: EventProps): void {
  const err = normalizeError(error);
  const safeContext = scrub(context);

  if (process.env.NODE_ENV !== "production") console.error("[reportError]", err, safeContext);

  safely("sentry", () => Sentry.captureException(err, { extra: safeContext }));
  safely("otel", () => {
    const span = trace.getActiveSpan();
    span?.recordException(err);
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  });
  for (const adapter of listAdapters()) {
    safely(adapter.name, () => adapter.error?.(err, safeContext));
  }
}

export function trackEvent(name: string, props?: EventProps): void {
  const safeProps = scrub(props);

  safely("sentry", () =>
    Sentry.addBreadcrumb({ category: "event", message: name, data: safeProps, level: "info" }),
  );
  safely("otel", () => trace.getActiveSpan()?.addEvent(name, safeProps));
  for (const adapter of listAdapters()) {
    safely(adapter.name, () => adapter.event?.(name, safeProps));
  }
}
