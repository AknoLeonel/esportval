# Esportval Futsal

Site do projeto de futsal **Esportval ("Fut’Art")**. Next.js 16 (App Router) · TypeScript estrito · Tailwind v4 · Motion · pronto para a Vercel.

> Antes de contribuir leia o **[AGENTS.md](./AGENTS.md)**: toda tarefa vira uma Issue e toda entrega vai por Pull Request mencionando a Issue.

## Rodando

```bash
npm install
cp .env.example .env.local   # opcional: tudo funciona sem chaves
npm run dev                  # http://localhost:3000
```

## O que tem na página

Hero com próximo jogo e números da temporada · jogos e resultados · classificação (pontos calculados) · elenco com filtro por posição · notícias · galeria com lightbox · formulário "Quero treinar".

Todo conteúdo mora em `src/data/*.ts` e hoje é **ilustrativo** (as seções mostram o selo "Conteúdo ilustrativo"). Para colocar o conteúdo real:

1. Edite os arquivos de `src/data/` (ou troque cada `getX()` por uma chamada a CMS/API: as seções já usam `Suspense` + skeleton).
2. Troque as imagens de `public/gallery/` por fotos reais (proporção 3:2) e ajuste `src/data/gallery.ts`.
3. Em `src/data/site.ts` mude `illustrativeContent` para `false`.
4. Substitua o escudo (`src/components/brand/Crest.tsx`, `src/app/icon.svg`) pelo arquivo oficial do clube; ajuste as cores em `src/app/globals.css` (`@theme`).

## Deploy na Vercel

1. Importe o repositório na Vercel (framework Next.js é detectado; `vercel.json` já define região `gru1` e headers de segurança).
2. **Fluxo por PR:** cada Pull Request gera um *Preview Deployment*; o merge na branch principal publica em produção. Não faça deploy manual.
3. Variáveis de ambiente (Project → Settings → Environment Variables), todas opcionais exceto a do formulário:

| Variável | Para quê |
|---|---|
| `CONTACT_WEBHOOK_URL` | **Necessária para o formulário entregar as inscrições.** URL de um webhook (Zapier, Make, Slack…) que recebe `{ text, lead, receivedAt }`. Sem ela o formulário avisa o visitante (HTTP 503) e envia o erro ao Sentry; nenhuma inscrição é "engolida" em silêncio. |
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
| `npm run test:e2e` | Playwright (desktop + mobile, axe, movimento reduzido) |
| `npm run mutation` | Stryker (mutation testing de `src/lib`) |

Commits seguem Conventional Commits (commitlint + Husky). O CI (`.github/workflows/ci.yml`) roda tudo e exige que o PR mencione uma Issue.
