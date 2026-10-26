# AGENTS.md — Esportval

Instruções para **qualquer agente de qualquer modelo** (Claude, Codex, Gemini, Copilot, Cursor…) e para pessoas.
Leia este arquivo inteiro antes de mexer no projeto. `CLAUDE.md` apenas aponta para cá.

**Projeto:** site institucional da **associação Esportval** · Next.js (App Router) + TypeScript + Tailwind v4 · deploy na Vercel · idioma **pt-BR**.

### Objetivo do site (leia antes de propor qualquer mudança)

A Esportval é uma **associação** (no modelo de ADEC e Liga Candanga), **não é escolinha nem clube de futebol**. O site existe para:

1. **Divulgar os projetos já realizados** (`/projetos` e `/projetos/[slug]`).
2. **Dar transparência e prestar contas** (`/transparencia`): toda parceria com o poder público, com os campos mínimos do **art. 11 da Lei 13.019/2014 (MROSC)**, documentos e situação da prestação de contas.

Não adicione jogos, tabela, elenco ou inscrição de atletas. O projeto de futsal (Fut'Art) é **um** dos projetos da associação.

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
  features/<x>/ home, projects, transparency, contact   → components, data, lib (nunca outra feature, nunca app)
  components/   UI reutilizável (ui/, brand/, media/…)  → lib (nunca features/app/data)
  data/         conteúdo de demonstração (tipado)       → lib/types apenas
  lib/          utilitários, motion, observability      → nada acima
```

Regras: sem dependência circular; uma feature não importa outra feature; `lib` e `data` nunca importam UI. O contrato vive em `.dependency-cruiser.cjs`.

Todo o conteúdo mora em `src/data/*.ts` (`site.ts`, `projects.ts`, `transparency.ts`). Para trocar pelo conteúdo real edite só esses arquivos; PDFs vão em `public/documentos/` e fotos em `public/projetos/`.

### Regras da transparência

- Cada parceria (`Partnership` em `lib/types.ts`) tem os campos do art. 11: instrumento, órgão, data de assinatura, organização e CNPJ, objeto, valor total e liberado, situação da prestação de contas (datas e resultado) e equipe paga com o recurso.
- **Nunca publique dado financeiro inventado.** Registro de exemplo precisa de `illustrative: true` (aparece com o selo "Exemplo") e instrumento "nº 000". Documento sem arquivo fica sem `href` e aparece como "Em publicação".
- A divulgação vai da assinatura até 180 dias após a prestação de contas final (Decreto 8.726/2016): não remova uma parceria antes disso.
- Razão social e CNPJ vêm de `site.organization`; enquanto `null`, o site mostra "em atualização".

---

## 3. Design e motion (skill [design-motion-principles](https://github.com/kylezantos/design-motion-principles))

Contexto do projeto = **site institucional** → lentes: **Jakub (principal)**, **Jhey (secundária, só no hero)**, **Emil (formulários, navegação, filtros e a transparência, que é lida com atenção)**.

Regras para toda interface:

- **Todo conteúdo tem skeleton.** Seção, lista, card e imagem têm estado de carregamento (`components/ui/Skeleton`): dados assíncronos ficam dentro de `<Suspense fallback={<XSkeleton/>}>` (com o cabeçalho da página fora do Suspense), blocos pesados em `LazyOnView`, imagens em `LazyImage`. **Não use `loading.tsx`**: ele coloca a página inteira dentro de um bloco escondido até o JS abrir (sem JS e para alguns robôs a página fica em branco). Nada "pula" na tela.
- **Lazy loading:** imagens com `LazyImage` (`next/image`, lazy por padrão, `eager` só acima da dobra); blocos pesados abaixo da dobra com `LazyOnView`; entradas com `Reveal` (`whileInView`).
- **Entrada suave:** `opacity 0→1` + `translateY ~8px→0` + `blur 4px→0`, spring `bounce: 0`, ~450 ms. **Saída é mais sutil que a entrada** (`translateY -4px`, 180 ms). Use `Reveal` (com `index` para cascata) ou as variantes `reveal`/`pop`/`page` de `lib/motion`; não crie animação solta. As variantes precisam ter **as mesmas chaves** com e sem movimento reduzido (a preferência só muda a transição, via `custom`), senão o blur do HTML do servidor fica preso.
- **Progresso e carregamento:** barra de leitura (`ScrollProgress`), barra de transição de rota (`RouteProgress`), entrada de página em `app/template.tsx` (`PageEnter`, não anima no primeiro carregamento), spinner e barra indeterminada no envio de formulário.
- **Frequência:** interações muito frequentes (teclado, filtros em lote) ficam instantâneas ou ≤180 ms. Botões: `scale(0.97)` em `:active`. Hover 150–200 ms. Nunca animar a partir de `scale(0)` (mínimo 0.9).
- **Apenas** `transform`, `opacity`, `filter`/`clip-path`. Nada de animar width/height/top/left. `will-change` pontual.
- **`prefers-reduced-motion` é obrigatório:** `MotionConfig reducedMotion="user"` + regra CSS global. Com movimento reduzido tudo continua usável (só some o movimento, o skeleton vira estático).
- Durações, easings e springs vêm **somente** de `src/lib/motion.ts`. Não escreva números mágicos nos componentes.
- Cores, fontes e raios vêm dos tokens em `src/app/globals.css` (`@theme`). Contraste mínimo WCAG AA.

Marca: **provisória** em `components/brand/Mark.tsx` (bola com quatro esportes, no espírito da logo antiga da associação) até o cliente enviar a logo e o timbrado originais. Paleta: laranja (`--color-brand`), grafite e branco. Tema escuro é o padrão.

---

## 4. Observabilidade

Wrapper único: **`src/lib/observability`** (`reportError`, `trackEvent`). Componentes **nunca** importam SDKs diretamente.

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
- **E2E:** Playwright em `e2e/` (desktop + mobile; axe em todas as páginas, movimento reduzido, resíduos de animação e vazamento horizontal no celular). `npm run test:e2e`.
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
