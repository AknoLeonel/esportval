import { registerOTel } from "@vercel/otel";
import { SERVICE_NAME } from "@/lib/observability/config";

/**
 * Traces no servidor (Node e Edge) via OpenTelemetry.
 * Na Vercel exporta sozinho; em outro host, defina OTEL_EXPORTER_OTLP_ENDPOINT (Datadog, New Relic, Grafana…).
 */
export async function register() {
  registerOTel({ serviceName: SERVICE_NAME });
  await import("./sentry.runtime");
}

export { captureRequestError as onRequestError } from "@sentry/nextjs";
