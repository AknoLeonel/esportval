/**
 * Leitura de configuração dos provedores. Funções puras: recebem o `env` e devolvem `null`
 * quando faltam chaves, o que desliga o provedor sem erro (build e testes não precisam de credenciais).
 */
export type Env = Record<string, string | undefined>;

const present = (value: string | undefined): value is string => !!value && value.trim() !== "";

export type DatadogConfig = {
  applicationId: string;
  clientToken: string;
  site: string;
};

export function datadogConfig(env: Env): DatadogConfig | null {
  const applicationId = env.NEXT_PUBLIC_DD_APPLICATION_ID;
  const clientToken = env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
  if (!present(applicationId) || !present(clientToken)) return null;
  return {
    applicationId: applicationId.trim(),
    clientToken: clientToken.trim(),
    site: present(env.NEXT_PUBLIC_DD_SITE) ? env.NEXT_PUBLIC_DD_SITE.trim() : "datadoghq.com",
  };
}

export type NewRelicConfig = {
  accountId: string;
  trustKey: string;
  agentId: string;
  licenseKey: string;
  applicationId: string;
};

export function newRelicConfig(env: Env): NewRelicConfig | null {
  const accountId = env.NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID;
  const agentId = env.NEXT_PUBLIC_NEWRELIC_AGENT_ID;
  const licenseKey = env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY;
  const applicationId = env.NEXT_PUBLIC_NEWRELIC_APPLICATION_ID;
  if (!present(accountId) || !present(agentId) || !present(licenseKey) || !present(applicationId)) {
    return null;
  }
  return {
    accountId: accountId.trim(),
    // Quando não informada, a conta é a própria "trust key".
    trustKey: present(env.NEXT_PUBLIC_NEWRELIC_TRUST_KEY)
      ? env.NEXT_PUBLIC_NEWRELIC_TRUST_KEY.trim()
      : accountId.trim(),
    agentId: agentId.trim(),
    licenseKey: licenseKey.trim(),
    applicationId: applicationId.trim(),
  };
}

export function sentryDsn(env: Env): string | null {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN;
  return present(dsn) ? dsn.trim() : null;
}

/** Variáveis NEXT_PUBLIC_* só são embutidas no bundle com acesso estático, por isso listamos uma a uma. */
export const publicEnv: Env = {
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_DD_APPLICATION_ID: process.env.NEXT_PUBLIC_DD_APPLICATION_ID,
  NEXT_PUBLIC_DD_CLIENT_TOKEN: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
  NEXT_PUBLIC_DD_SITE: process.env.NEXT_PUBLIC_DD_SITE,
  NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID: process.env.NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID,
  NEXT_PUBLIC_NEWRELIC_TRUST_KEY: process.env.NEXT_PUBLIC_NEWRELIC_TRUST_KEY,
  NEXT_PUBLIC_NEWRELIC_AGENT_ID: process.env.NEXT_PUBLIC_NEWRELIC_AGENT_ID,
  NEXT_PUBLIC_NEWRELIC_LICENSE_KEY: process.env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY,
  NEXT_PUBLIC_NEWRELIC_APPLICATION_ID: process.env.NEXT_PUBLIC_NEWRELIC_APPLICATION_ID,
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
};

export const SERVICE_NAME = "esportval";

export function environmentName(env: Env, nodeEnv: string | undefined): string {
  return present(env.NEXT_PUBLIC_VERCEL_ENV)
    ? env.NEXT_PUBLIC_VERCEL_ENV
    : (nodeEnv ?? "development");
}
