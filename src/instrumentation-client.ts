import * as Sentry from "@sentry/nextjs";
import { environmentName, publicEnv, sentryDsn } from "@/lib/observability/config";

const dsn = sentryDsn(publicEnv);

if (dsn) {
  Sentry.init({
    dsn,
    environment: environmentName(publicEnv, process.env.NODE_ENV),
    tracesSampleRate: 0.1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
