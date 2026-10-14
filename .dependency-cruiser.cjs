/**
 * Contrato de arquitetura (npm run arch). Camadas, de cima para baixo:
 *   app → features → components → lib        data → lib/types
 * Uma camada só enxerga as de baixo. Documentado em AGENTS.md (seção 2).
 */
const forbid = (name, comment, from, to) => ({
  name,
  comment,
  severity: "error",
  from,
  to,
});

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "Dependência circular torna o código frágil e difícil de testar.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    forbid(
      "lib-is-a-leaf",
      "src/lib não pode importar UI, features, dados ou rotas.",
      { path: "^src/lib/", pathNot: "\\.test\\.tsx?$" },
      { path: "^src/(app|features|components|data)/" },
    ),
    forbid(
      "data-only-needs-types",
      "src/data guarda conteúdo: só pode importar tipos de src/lib/types.",
      { path: "^src/data/" },
      { path: "^src/(app|features|components)/|^src/lib/(?!types)" },
    ),
    forbid(
      "components-are-reusable",
      "src/components é UI genérica: não conhece features, rotas nem dados do clube.",
      { path: "^src/components/", pathNot: "\\.test\\.tsx?$" },
      { path: "^src/(app|features|data)/" },
    ),
    forbid(
      "features-do-not-import-app",
      "Features não dependem de rotas.",
      { path: "^src/features/" },
      { path: "^src/app/" },
    ),
    forbid(
      "features-are-isolated",
      "Uma feature não importa outra: extraia o que for comum para src/components ou src/lib.",
      {
        path: "^src/features/([^/]+)/",
        pathNot: "^src/features/[^/]+/.*\\.test\\.tsx?$|^src/features/sections\\.test\\.tsx$",
      },
      { path: "^src/features/", pathNot: "^src/features/$1/" },
    ),
    forbid(
      "sdk-only-in-observability",
      "SDKs de observabilidade só entram via src/lib/observability (ou arquivos de instrumentação).",
      {
        path: "^src/",
        pathNot:
          "^src/(lib/observability/|instrumentation(-client)?\\.ts$|sentry\\.runtime\\.ts$)|\\.test\\.tsx?$",
      },
      { path: "node_modules/(@sentry|@datadog|@newrelic|@vercel/otel|@opentelemetry)/" },
    ),
  ],
  options: {
    tsConfig: { fileName: "tsconfig.json" },
    doNotFollow: {
      path: "node_modules",
      dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled"],
    },
    exclude: { path: "\\.next|coverage" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
    reporterOptions: { text: { highlightFocused: true } },
  },
};
