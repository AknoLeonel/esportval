"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/observability";

/** Último recurso: erro no layout raiz. Precisa renderizar <html> e <body> próprios. */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    reportError(error, { boundary: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#07090d",
          color: "#f4f1ea",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Algo saiu do jogo</h1>
          <p style={{ color: "#a9b2bf" }}>Recarregue a página para voltar à quadra.</p>
        </div>
      </body>
    </html>
  );
}
