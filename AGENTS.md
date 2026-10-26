# AGENTS.md — Esportval Futsal

Instruções para **qualquer agente de qualquer modelo** (Claude, Codex, Gemini, Copilot, Cursor…) e para pessoas.
Leia este arquivo inteiro antes de mexer no projeto. `CLAUDE.md` apenas aponta para cá.

**Projeto:** site do projeto de futsal Esportval ("Fut'Art"), Brasília-DF · Next.js (App Router) + TypeScript + Tailwind v4 · deploy na Vercel · idioma **pt-BR**.

---

## 1. Fluxo de trabalho (OBRIGATÓRIO)

1. **Toda tarefa vira uma Issue no GitHub antes de qualquer código** — Correção, Melhoria ou Nova função. Use os templates em `.github/ISSUE_TEMPLATE`. O título começa com `[Correção]`, `[Melhoria]` ou `[Nova função]`, e o corpo traz contexto + escopo em checkboxes.
2. **Uma branch por tarefa** (`feat/<n>-slug`, `fix/<n>-slug`, `improve/<n>-slug`) — ou a branch designada pela sessão/ferramenta do agente.
3. **Toda entrega vai por Pull Request** e **a descrição do PR menciona a Issue** com `Closes #N` (ou `Refs #N` se for parcial). PR sem Issue citada não é mergeado. Use `.github/pull_request_template.md`.
4. **Deploys são gerenciados por PR:** cada PR gera um *preview* na Vercel; o merge na branch principal publica em produção. Nunca faça deploy manual nem push direto na branch principal.
5. **Commits** seguem Conventional Commits (validado pelo commitlint): `feat(matches): lista de jogos (#3)`. Tipos: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `style`.
6. Antes de abrir o PR rode `npm run check` (e `npm run test:e2e` se mexeu em fluxo). O CI roda tudo de novo.
7. Descobriu algo fora do escopo? Abra outra Issue, não amplie o PR.

> Ao trabalhar nesta base, se o pedido do usuário não tiver Issue, **crie a Issue primeiro** e cite o número no PR.

---

## 2. Arquitetura (contrato verificado por `npm run arch`)

```
src/
  app/          rotas, layouts, loading/error, API      → pode importar tudo abaixo
  features/<x>/ seções da página (hero, matches, …)     → components, data, lib (nunca outra feature, nunca app)
  components/   UI reutilizável (ui/, brand/)           → lib (nunca features/app/data)
  data/         conteúdo de demonstração (tipado)       → lib/types apenas
  lib/          utilitários, motion, observability      → nada acima
```

Regras: sem dependência circular; uma feature não importa outra feature; `lib` e `data` nunca importam UI. O contrato vive em `.dependency-cruiser.cjs`.

Conteúdo (jogos, elenco, notícias, tabela) é **dado de demonstração** em `src/data/*.ts`. Para trocar pelo conteúdo real do cliente edite só esses arquivos.

---

## 3. Design e motion (skill [design-motion-principles](https://github.com/kylezantos/design-motion-principles))

Contexto do projeto = **site institucional/marketing** → lentes: **Jakub (principal)**, **Jhey (secundária, momentos de destaque como hero e placar)**, **Emil (formulários, navegação, filtros)**.

Regras para toda interface:

- **Todo conteúdo tem skeleton.** Seção, lista, card e imagem têm estado de carregamento (`components/ui/Skeleton`): dados assíncronos ficam dentro de `<Suspense fallback={<XSkeleton/>}>`, blocos pesados em `LazyOnView`, imagens em `LazyImage`. Toda **rota nova com dados assíncronos** ganha um `loading.tsx`. Não crie `loading.tsx` na raiz: ele empurra o hero para dentro de um bloco escondido até o JS abrir. Nada "pula" na tela.
- **Lazy loading:** imagens com `next/image` (`loading="lazy"` abaixo da dobra, `priority` só no hero), seções abaixo da dobra com `LazySection` (`next/dynamic` + `whileInView`).
- **Entrada suave:** `opacity 0→1` + `translateY ~8px→0` + `blur 4px→0`, spring `bounce: 0`, ~450 ms. **Saída é mais sutil que a entrada** (`translateY -12px`, sem espera longa). Use `Reveal`, `Stagger`, `Presence` de `components/ui`; não crie animação solta.
- **Progresso e carregamento:** barra de scroll, barra de transição de rota, spinner/progresso em envio de formulário e em filtros.
- **Frequência:** interações muito frequentes (teclado, filtros em lote) ficam instantâneas ou ≤180 ms. Botões: `scale(0.97)` em `:active`. Hover 150–200 ms. Nunca animar a partir de `scale(0)` (mínimo 0.9).
- **Apenas** `transform`, `opacity`, `filter`/`clip-path`. Nada de animar width/height/top/left. `will-change` pontual.
- **`prefers-reduced-motion` é obrigatório:** `MotionConfig reducedMotion="user"` + regra CSS global. Com movimento reduzido tudo continua usável (só some o movimento, o skeleton vira estático).
- Durações, easings e springs vêm **somente** de `src/lib/motion.ts`. Não escreva números mágicos nos componentes.
- Cores, fontes e raios vêm dos tokens em `src/app/globals.css` (`@theme`). Contraste mínimo WCAG AA.

Marca: laranja (`--color-brand`), grafite/preto e branco, inspirada no escudo Fut'Art (bola + trave). Tema escuro é o padrão.

---

## 4. Observabilidade

Wrapper único: **`src/lib/observability`** (`reportError`, `trackEvent`, `trackTiming`). Componentes **nunca** importam SDKs diretamente.

| Provedor | Onde | Ativa com |
|---|---|---|
| Sentry | `src/instrumentation*.ts`, `src/sentry.runtime.ts`, error boundaries | `NEXT_PUBLIC_SENTRY_DSN` |
| OpenTelemetry | `instrumentation.ts` (`@vercel/otel`) | sempre (OTLP extra via `OTEL_EXPORTER_OTLP_ENDPOINT`) |
| Datadog RUM | `lib/observability/client.ts` (`@datadog/browser-rum`, sem session replay por causa de dados pessoais) | `NEXT_PUBLIC_DD_APPLICATION_ID` + `NEXT_PUBLIC_DD_CLIENT_TOKEN` |
| (init no navegador) | `components/observability/Observability` | — |
| New Relic Browser | `lib/observability/client.ts` (`@newrelic/browser-agent`) | `NEXT_PUBLIC_NEWRELIC_*` |

Sem chave o provedor fica desligado **sem erro** (build e testes não exigem credenciais). Toda rota de API e todo `catch` relevante chama `reportError`. Variáveis novas entram em `.env.example`.

---

## 5. Qualidade de código

| Ferramenta | Comando | Para quê |
|---|---|---|
| Biome | `npm run lint` / `lint:fix` / `format` | lint + formatação (sem ESLint/Prettier) |
| TypeScript estrito | `npm run typecheck` | `strict` + `noUncheckedIndexedAccess` |
| Commitlint + Husky | hook `commit-msg` | Conventional Commits |
| Knip | `npm run knip` | arquivos, exports e dependências sem uso |
| dependency-cruiser | `npm run arch` | contrato de arquitetura (seção 2) |
| Stryker | `npm run mutation` | mutation testing de `src/lib` (runner de comando: o `vitest-runner` 10 não ativa mutantes com Vitest 5) |

`npm run check` = lint + typecheck + knip + arch + testes. Não desative regra para passar: corrija ou justifique no PR.

---

## 6. Testes

- **Unitário e integração:** Vitest + Testing Library (`*.test.ts(x)` ao lado do código). `npm test`, `npm run test:coverage`.
- **E2E:** Playwright em `e2e/` (inclui axe de acessibilidade e modo reduced-motion). `npm run test:e2e`.
- **Cobertura:** enviada ao Codecov pelo CI; o mínimo está em `vitest.config.ts` e `codecov.yml`.
- Todo bug corrigido ganha um teste que falha sem a correção. Toda feature nova ganha teste de integração e, se tiver fluxo de usuário, E2E.

---

## 7. Comandos

```bash
npm install        # instala e ativa os hooks do Husky
npm run dev        # http://localhost:3000
npm run check      # lint + tipos + knip + arch + testes
npm run build      # build de produção (igual à Vercel)
npm run test:e2e   # Playwright (sobe o app sozinho)
```

## 8. Segurança

Nunca commitar `.env*` (exceto `.env.example`). Chaves vivem nas variáveis de ambiente da Vercel. Dados enviados no formulário de contato são validados com Zod no servidor e não são logados em texto puro.
