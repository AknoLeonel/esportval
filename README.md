# Esportval

Site institucional da **associação Esportval**: divulga os **projetos esportivos realizados** e publica a **prestação de contas** de cada parceria com o poder público (Lei 13.019/2014, art. 11). Next.js 16 (App Router) · TypeScript estrito · Tailwind v4 · Motion · pronto para a Vercel.

> Antes de contribuir leia o **[AGENTS.md](./AGENTS.md)**: toda tarefa vira uma Issue e toda entrega vai por Pull Request mencionando a Issue.

## Rodando

```bash
npm install
cp .env.example .env.local   # opcional: tudo funciona sem chaves
npm run dev                  # http://localhost:3000
```

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | O que a associação faz, números, projetos em destaque, resumo da transparência, quem somos e contato |
| `/projetos` | Todos os projetos, com filtro por modalidade e situação |
| `/projetos/[slug]` | Página de cada projeto: ficha, resultados, galeria e link para a prestação de contas |
| `/transparencia` | Parcerias com o poder público (campos do art. 11), documentos e documentos institucionais |

## Colocando o conteúdo real

Hoje os projetos e as parcerias são **exemplos** (aparecem com o selo "Exemplo"). Para publicar:

1. **Dados da associação** em `src/data/site.ts` → `organization` (razão social, CNPJ, endereço, e-mail).
2. **Projetos** em `src/data/projects.ts`. Fotos em `public/projetos/` (proporção 3:2).
3. **Parcerias** em `src/data/transparency.ts`, com os campos do art. 11. PDFs em `public/documentos/` e o caminho no `href` de cada documento (sem `href` = "Em publicação").
4. **Documentos institucionais** (estatuto, ata da diretoria, CNPJ, certidões, balanços, relatório anual) no mesmo arquivo.
5. Apague os registros de exemplo e mude `illustrativeContent` para `false` em `src/data/site.ts`.
6. **Marca:** troque `src/components/brand/Mark.tsx` e `src/app/icon.svg` pela logo oficial; ajuste as cores em `src/app/globals.css` (`@theme`).

## Deploy na Vercel

1. Importe o repositório na Vercel (framework Next.js é detectado; `vercel.json` já define região `gru1` e headers de segurança).
2. **Fluxo por PR:** cada Pull Request gera um *Preview Deployment*; o merge na branch principal publica em produção. Não faça deploy manual.
3. Variáveis de ambiente (Project → Settings → Environment Variables), todas opcionais exceto a do formulário:

| Variável | Para quê |
|---|---|
| `CONTACT_WEBHOOK_URL` | **Necessária para o formulário de contato entregar as mensagens.** URL de um webhook (Zapier, Make, Slack…) que recebe `{ text, lead, receivedAt }`. Sem ela o formulário avisa o visitante (HTTP 503) e envia o erro ao Sentry; nenhuma mensagem é "engolida" em silêncio. |
| `NEXT_PUBLIC_SITE_URL` | URL canônica (sitemap, OG, JSON-LD). |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Sentry (erros; token só para subir source maps). |
| `NEXT_PUBLIC_DD_APPLICATION_ID`, `NEXT_PUBLIC_DD_CLIENT_TOKEN`, `NEXT_PUBLIC_DD_SITE` | Datadog RUM. |
| `NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID`, `_AGENT_ID`, `_LICENSE_KEY`, `_APPLICATION_ID`, `_TRUST_KEY` | New Relic Browser. |
| `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS` | Exportar traces OpenTelemetry para outro destino (na Vercel já funciona via `@vercel/otel`). |

4. No GitHub, adicione o segredo `CODECOV_TOKEN` para publicar a cobertura.

## Qualidade e testes

| Comando | O que faz |
|---|---|
| `npm run check` | lint + tipos + knip + arquitetura + testes |
| `npm run lint` / `lint:fix` | Biome |
| `npm run knip` | código e dependências sem uso |
| `npm run arch` | contrato de arquitetura (dependency-cruiser) |
| `npm test` / `test:coverage` | Vitest (unitário + integração), limite de cobertura |
| `npm run test:e2e` | Playwright (desktop + mobile, axe em todas as páginas, movimento reduzido) |
| `npm run mutation` | Stryker (mutation testing de `src/lib`) |

Commits seguem Conventional Commits (commitlint + Husky). O CI (`.github/workflows/ci.yml`) roda tudo e exige que o PR mencione uma Issue.
