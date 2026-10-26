import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** Rola a página inteira, devagar como uma pessoa, para disparar as entradas (whileInView) e o lazy loading. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
}

/** Elementos visíveis de <main> que terminaram a animação com blur/deslocamento/opacidade residuais. */
async function animationLeftovers(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main *")]
      // Elementos escondidos (display:none, ex.: colunas no mobile) nunca entram na tela.
      .filter((el) => el.getClientRects().length > 0)
      .filter((el) => {
        const { filter, transform, opacity } = el.style;
        const stuckFilter = filter !== "" && filter !== "none";
        const stuckTransform = transform !== "" && transform !== "none";
        return stuckFilter || stuckTransform || opacity === "0";
      })
      .map((el) => `${el.tagName.toLowerCase()}[style="${el.getAttribute("style")}"]`),
  );
}

/** Nada pode vazar para a direita da tela (rolagem horizontal acidental). */
async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

/** Link do menu principal; no celular abre o menu móvel antes. */
async function clickNav(page: Page, name: string) {
  const desktop = page.getByRole("navigation", { name: "Principal" });
  if (await desktop.isVisible()) {
    await desktop.getByRole("link", { name }).click();
    return;
  }
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("navigation", { name: "Menu móvel" }).getByRole("link", { name }).click();
}

async function fillContact(page: Page) {
  await page.getByLabel("Nome", { exact: true }).fill("Maria Souza");
  await page.getByLabel("E-mail", { exact: true }).fill("maria@example.com");
  await page.getByLabel("Assunto").selectOption("Transparência e prestação de contas");
  await page.getByLabel("Mensagem").fill("Gostaria do relatório do festival.");
  await page.getByRole("checkbox").check();
}

test.describe("home institucional", () => {
  test("explica o que a associação faz e leva a projetos e transparência", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Esportval/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Projetos esportivos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("com as contas abertas");
    await expect(page.getByRole("link", { name: "Ver projetos" })).toHaveAttribute(
      "href",
      "/projetos",
    );
    await expect(page.getByRole("link", { name: "Prestação de contas" })).toHaveAttribute(
      "href",
      "/transparencia",
    );
    await expect(page.getByText("Projetos realizados")).toBeVisible();
  });

  test("não tem mais conteúdo de clube (jogos, tabela, elenco)", async ({ page }) => {
    await page.goto("/");
    for (const text of ["Classificação", "Elenco", "Próximo jogo", "Quero treinar"]) {
      await expect(page.getByText(text, { exact: true })).toHaveCount(0);
    }
  });

  test("SEO: JSON-LD de organização, sitemap com as rotas novas e robots", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({
      "@type": "SportsOrganization",
      name: "Esportval",
    });
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/transparencia");
    expect(sitemap).toContain("/projetos/festival-multiesportes");
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  });

  test("páginas internas mantêm imagem, nome do site e idioma no compartilhamento", async ({
    request,
  }) => {
    for (const path of ["/projetos/festival-multiesportes", "/projetos", "/transparencia"]) {
      const html = await (await request.get(path)).text();
      expect(html, path).toMatch(/<meta property="og:image" content="[^"]*\/opengraph-image/);
      expect(html, path).toContain('<meta property="og:site_name" content="Esportval"');
      expect(html, path).toContain('<meta property="og:locale" content="pt_BR"');
    }
    const image = await request.get("/opengraph-image");
    expect(image.headers()["content-type"]).toBe("image/png");
  });

  test("HTML inicial traz o conteúdo real, não só esqueletos", async ({ request }) => {
    const home = await (await request.get("/")).text();
    expect(home).toContain("com as contas abertas");
    expect(home).toContain("Festival Multiesportes");
    const transparency = await (await request.get("/transparencia")).text();
    expect(transparency).toContain("Termo de Fomento nº 000/2025");
    expect(transparency).toContain("Estatuto social");
  });
});

test.describe("navegação", () => {
  test("header leva às páginas, marca a atual e a página entra sem resíduos de animação", async ({
    page,
  }) => {
    await page.goto("/");
    await clickNav(page, "Transparência");
    await expect(page).toHaveURL(/\/transparencia$/);
    await expect(page.getByRole("heading", { level: 1, name: "Transparência" })).toBeVisible();
    // no celular o menu desktop fica oculto, mas a marcação de página atual continua lá
    await expect(
      page.locator('nav[aria-label="Principal"] a[href="/transparencia"]'),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByTestId("route-progress")).toHaveCount(0);
    // blocos abaixo da dobra só entram quando chegam na tela
    await scrollThrough(page);
    await expect.poll(() => animationLeftovers(page)).toEqual([]);
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

  test("projeto inexistente também é 404", async ({ page }) => {
    const response = await page.goto("/projetos/nao-existe");
    expect(response?.status()).toBe(404);
  });
});

test.describe("projetos", () => {
  test("filtra por modalidade e abre a página do projeto", async ({ page }) => {
    await page.goto("/projetos");
    await expect(page.getByText("4 projetos encontrados")).toBeAttached();
    await page.getByRole("button", { name: "Vôlei" }).click();
    await expect(page.getByText("1 projeto encontrado")).toBeAttached();
    await page.getByRole("link", { name: "Vôlei na Comunidade" }).click();
    await expect(page).toHaveURL(/\/projetos\/volei-na-comunidade$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vôlei na Comunidade");
    await expect(page.locator('nav[aria-label="Principal"] a[href="/projetos"]')).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("do projeto chega à prestação de contas da parceria que o financiou", async ({ page }) => {
    await page.goto("/projetos/volei-na-comunidade");
    await page.getByRole("link", { name: /Termo de Colaboração nº 000\/2024/ }).click();
    await expect(page).toHaveURL(/\/transparencia#p-2024-01$/);
    await expect(
      page.getByRole("region", { name: "Detalhes: Termo de Colaboração nº 000/2024" }),
    ).toBeVisible();
  });

  test("galeria do projeto: abre e fecha o lightbox com teclado, cobrindo a tela", async ({
    page,
  }) => {
    await page.goto("/projetos/projeto-futsal-fut-art");
    await scrollThrough(page);
    const first = page.getByRole("button", { name: "Ampliar: Aquecimento" });
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect.poll(async () => (await dialog.boundingBox())?.y).toBe(0);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("2/2");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("transparência", () => {
  test("cada parceria mostra os campos mínimos do art. 11 da Lei 13.019/2014", async ({ page }) => {
    await page.goto("/transparencia");
    await expect(page.getByText("3 parcerias")).toBeVisible();
    await page.getByRole("button", { name: /Termo de Fomento nº 000\/2025/ }).click();
    const details = page.getByRole("region", { name: "Detalhes: Termo de Fomento nº 000/2025" });
    for (const label of [
      "Instrumento (I)",
      "Órgão responsável (I)",
      "Data de assinatura (I)",
      "Organização e CNPJ (II)",
      "Objeto (III)",
      "Valor total (IV)",
      "Valor liberado (IV)",
      "Prestação de contas (V)",
      "Equipe paga com a parceria (VI)",
      "Documentos",
    ]) {
      await expect(details.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(details.getByText("Em publicação").first()).toBeVisible();
  });

  test("busca e filtro por situação", async ({ page }) => {
    await page.goto("/transparencia");
    // "vôlei" aparece em duas parcerias (aulas e festival); a busca ignora acentos
    await page.getByRole("searchbox").fill("volei");
    await expect(page.getByText("2 parcerias", { exact: true })).toBeVisible();
    await page.getByRole("searchbox").fill("corrida");
    await expect(page.getByText("1 parceria", { exact: true })).toBeVisible();
    await page.getByRole("searchbox").fill("");
    await page.getByLabel("Situação das contas").selectOption("aprovada");
    await expect(page.getByText("1 parceria", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Termo de Colaboração/ })).toBeVisible();
  });

  test("dados de exemplo ficam sinalizados", async ({ page }) => {
    await page.goto("/transparencia");
    await expect(page.getByText("Dados de exemplo")).toBeVisible();
    await expect(page.getByText(/não são dados reais da associação/)).toBeVisible();
  });

  test("detalhes abertos não vazam para a direita no celular", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/transparencia#p-2025-01");
    const details = page.getByRole("region", { name: "Detalhes: Termo de Fomento nº 000/2025" });
    await expect(details).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    const clipped = await details.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(clipped).toBeLessThanOrEqual(1);
  });
});

test.describe("contato", () => {
  test("valida no cliente e mostra erro acessível", async ({ page }) => {
    await page.goto("/#contato");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("Informe seu nome.")).toBeVisible();
    await expect(page.getByLabel("Nome", { exact: true })).toBeFocused();
  });

  test("envia com sucesso (API simulada)", async ({ page }) => {
    await page.route("**/api/contato", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
    );
    await page.goto("/#contato");
    await fillContact(page);
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("Recebemos sua mensagem!")).toBeVisible();
  });

  test("sem webhook configurado o usuário é avisado (nada é perdido em silêncio)", async ({
    page,
  }) => {
    await page.goto("/#contato");
    await fillContact(page);
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("Não conseguimos enviar agora");
  });
});

test.describe("animações não deixam resíduos", () => {
  for (const path of ["/", "/projetos", "/transparencia", "/projetos/festival-multiesportes"]) {
    test(`sem movimento reduzido: ${path}`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      await expect.poll(() => animationLeftovers(page)).toEqual([]);
    });
  }
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/", "/transparencia"]) {
    test(`conteúdo nítido e no lugar, só com fade: ${path}`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      // Regressão: com movimento reduzido o SSR trazia blur(4px)/translateY(8px) que nunca eram limpos.
      await expect.poll(() => animationLeftovers(page)).toEqual([]);
      const duration = await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".skeleton, a, button") as Element)
            .transitionDuration,
      );
      expect(Number.parseFloat(duration)).toBeLessThan(0.01);
    });
  }
});

test.describe("acessibilidade (axe)", () => {
  for (const path of [
    "/",
    "/projetos",
    "/projetos/festival-multiesportes",
    "/transparencia#p-2025-01",
  ]) {
    test(`sem violações sérias ou críticas: ${path}`, async ({ page }) => {
      await page.goto(path);
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
  }
});
