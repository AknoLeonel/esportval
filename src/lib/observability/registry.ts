import type { EventProps } from "./scrub";

/** Provedor de observabilidade do navegador (Datadog, New Relic…). */
export type Adapter = {
  name: string;
  error?: (error: Error, context?: EventProps) => void;
  event?: (name: string, props?: EventProps) => void;
};

const adapters = new Map<string, Adapter>();

export function registerAdapter(adapter: Adapter): void {
  adapters.set(adapter.name, adapter);
}

export function listAdapters(): Adapter[] {
  return [...adapters.values()];
}

/** Só para testes. */
export function clearAdapters(): void {
  adapters.clear();
}
