"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { reportError } from "@/lib/observability";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "route", digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-2xl place-content-center gap-6 px-5 text-center">
      <p className="font-display text-sm font-bold tracking-[0.28em] text-brand uppercase">
        Cartão amarelo
      </p>
      <h1 className="font-display text-6xl font-extrabold uppercase">Algo saiu do jogo</h1>
      <p className="text-fg-muted">
        Já avisamos a equipe. Tente de novo; se persistir, volte em instantes.
      </p>
      <div>
        <Button onClick={reset}>Tentar de novo</Button>
      </div>
    </div>
  );
}
