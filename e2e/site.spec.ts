import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** Rola a página inteira para disparar as entradas (whileInView) e o lazy loading. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
}

test.describe("página de futsal", () => {
  test("mostra o hero, o próximo jogo e os números da temporada", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Esportval Futsal/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Oportunidades não surgem");
    await expect(page.getByLabel("Próximo jogo")).toContainText("Esportval × Ipê Futsal");
    await expect(page.getByRole("link", { name: "Quero treinar" }).first()).toBeVisible();
  });

  test("tem metadados de SEO, JSON-LD, sitemap e robots", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({ "@type": "SportsTeam", sport: "Futsal" });
    expect((await request.get("/sitemap.xml")).ok()).toBe(true);
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  });

  test("alterna entre próximos jogos e resultados", async ({ page }) => {
    await page.goto("/#jogos");
    const results = page.getByRole("tab", { name: "Resultados" });
    await results.scrollIntoViewIfNeeded();
    await results.click();
    await expect(page.getByText("Vitória").first()).toBeVisible();
    await expect(results).toHaveAttribute("aria-selected", "true");
  });

  test("classificação destaca a nossa equipe", async ({ page }) => {
    await page.goto("/");
    const us = page
      .getByRole("row", { name: /Esportval/ })
      .and(page.locator("[aria-current='true']"));
    await us.scrollIntoViewIfNeeded();
    await expect(us).toBeVisible();
  });

  test("filtra o elenco por posição", async ({ page }) => {
    await page.goto("/#elenco");
    await page.getByRole("button", { name: "Goleiros" }).click();
    await expect(page.getByText("2 atletas exibidos")).toBeAttached();
    await expect(page.getByText("Rafael")).toBeVisible();
    await expect(page.getByText("Lucas")).toHaveCount(0);
  });

  test("galeria: abre, navega e fecha o lightbox com teclado", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    const first = page.getByRole("button", { name: "Ampliar: Dia de jogo" });
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Regressão: o lightbox precisa cobrir a viewport inteira (não ficar preso a um ancestral com filter/transform).
    await expect.poll(async () => (await dialog.boundingBox())?.y).toBe(0);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("2/6");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("contato: valida no cliente e mostra erro acessível", async ({ page }) => {
    await page.goto("/#contato");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("Informe seu nome completo.")).toBeVisible();
    await expect(page.getByLabel("Nome completo")).toBeFocused();
  });

  test("contato: envia com sucesso (API simulada)", async ({ page }) => {
    await page.route("**/api/contato", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
    );
    await page.goto("/#contato");
    await page.getByLabel("Nome completo").fill("Maria Souza");
    await page.getByLabel("E-mail", { exact: true }).fill("maria@example.com");
    await page.getByLabel("WhatsApp / telefone").fill("(61) 91234-5678");
    await page.getByLabel("Categoria do atleta").selectOption("Sub-13");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("Recebemos seu contato!")).toBeVisible();
  });

  test("contato: sem webhook configurado o usuário é avisado (nada é perdido em silêncio)", async ({
    page,
  }) => {
    await page.goto("/#contato");
    await page.getByLabel("Nome completo").fill("Maria Souza");
    await page.getByLabel("E-mail", { exact: true }).fill("maria@example.com");
    await page.getByLabel("WhatsApp / telefone").fill("(61) 91234-5678");
    await page.getByLabel("Categoria do atleta").selectOption("Sub-13");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("Não conseguimos enviar agora");
  });

  test("a barra de progresso de leitura acompanha a rolagem", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByTestId("scroll-progress");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect
      .poll(async () => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
      .toBeGreaterThan(0.2);
  });

  test("rota inexistente mostra a página 404", async ({ page }) => {
    const response = await page.goto("/nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("todo o conteúdo fica visível e utilizável sem animação", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    await expect(page.getByRole("heading", { name: "Jogos e resultados" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Classificação" })).toBeVisible();
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>("main *")].filter(
          (el) => el.style.opacity === "0",
        ).length,
    );
    expect(hidden).toBe(0);
    const duration = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector(".skeleton, a, button") as Element)
          .transitionDuration,
    );
    expect(parseFloat(duration)).toBeLessThan(0.01);
  });
});

test.describe("HTML inicial (SEO e leitores sem JavaScript)", () => {
  test("traz o conteúdo real no HTML, não só os esqueletos", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Oportunidades não surgem");
    expect(html).toContain("Cerrado Futsal");
    expect(html).toContain("Peneira aberta");
    expect(html).toContain("Rafael");
  });
});

test.describe("acessibilidade (axe)", () => {
  test("não há violações sérias ou críticas", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious,
      JSON.stringify(
        serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        null,
        2,
      ),
    ).toEqual([]);
  });
});
