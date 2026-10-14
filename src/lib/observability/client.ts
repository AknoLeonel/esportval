import { datadogConfig, environmentName, newRelicConfig, publicEnv, SERVICE_NAME } from "./config";
import { registerAdapter } from "./registry";

let started = false;

async function startDatadog(): Promise<void> {
  const config = datadogConfig(publicEnv);
  if (!config) return;
  const { datadogRum } = await import("@datadog/browser-rum");
  datadogRum.init({
    applicationId: config.applicationId,
    clientToken: config.clientToken,
    site: config.site,
    service: SERVICE_NAME,
    env: environmentName(publicEnv, process.env.NODE_ENV),
    version: publicEnv.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    sessionSampleRate: 100,
    // Sem gravação de tela: o formulário de contato recebe dados pessoais.
    sessionReplaySampleRate: 0,
    defaultPrivacyLevel: "mask",
  });
  registerAdapter({
    name: "datadog",
    error: (error, context) => datadogRum.addError(error, context),
    event: (name, props) => datadogRum.addAction(name, props),
  });
}

async function startNewRelic(): Promise<void> {
  const config = newRelicConfig(publicEnv);
  if (!config) return;
  const { BrowserAgent } = await import("@newrelic/browser-agent/loaders/browser-agent");
  const agent = new BrowserAgent({
    init: {
      distributed_tracing: { enabled: true },
      privacy: { cookies_enabled: true },
      ajax: { deny_list: ["bam.nr-data.net"] },
    },
    info: {
      beacon: "bam.nr-data.net",
      errorBeacon: "bam.nr-data.net",
      licenseKey: config.licenseKey,
      applicationID: config.applicationId,
      sa: 1,
    },
    loader_config: {
      accountID: config.accountId,
      trustKey: config.trustKey,
      agentID: config.agentId,
      licenseKey: config.licenseKey,
      applicationID: config.applicationId,
    },
  });
  registerAdapter({
    name: "newrelic",
    error: (error, context) => agent.noticeError(error, context),
    event: (name, props) => agent.addPageAction(name, props),
  });
}

/** Inicia Datadog RUM e New Relic no navegador (Sentry sobe em instrumentation-client.ts). */
export function initClientObservability(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  for (const start of [startDatadog, startNewRelic]) {
    start().catch((failure) => {
      if (process.env.NODE_ENV !== "production") console.warn("[observability:init]", failure);
    });
  }
}
