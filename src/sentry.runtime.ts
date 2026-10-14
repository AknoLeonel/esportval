import * as Sentry from "@sentry/nextjs";
import { environmentName, publicEnv, sentryDsn } from "@/lib/observability/config";

const dsn = sentryDsn(publicEnv);

if (dsn) {
  Sentry.init({
    dsn,
    environment: environmentName(publicEnv, process.env.NODE_ENV),
    // O OpenTelemetry (@vercel/otel) é o dono dos traces no servidor; o Sentry cuida dos erros
    // (sem tracesSampleRate o tracing do Sentry fica desligado).
  });
}
