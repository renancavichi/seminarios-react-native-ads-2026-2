import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
async function settle(page: Page) {
  await page.waitForFunction(() => {
    const s = document.querySelector(".slide-content");
    return s && Number(getComputedStyle(s).opacity) > 0.99;
  });
  await page.evaluate(() => document.fonts.ready);
}
for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
]) {
  test(`todos os slides cabem em ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (let slide = 1; slide <= 17; slide++) {
      await page.goto(`/#slide-${String(slide).padStart(2, "0")}`);
      await settle(page);
      await expect(page.getByRole("main")).toHaveAttribute(
        "aria-label",
        new RegExp(`Slide ${slide}:`),
      );
      if (slide === 7)
        for (let i = 0; i < 9; i++) await page.keyboard.press("ArrowRight");
      if (slide === 14)
        for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight");
      await settle(page);
      const failures = await page.evaluate(() => {
        const main = document.querySelector("main")!.getBoundingClientRect();
        const nodes = document.querySelectorAll(
          "main h1,main h2,main h3,main p,main pre,main button,main .callout,main table,main .references,main .provider-table,main .code-window",
        );
        return [...nodes]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return (
              r.top < main.top - 2 ||
              r.bottom > main.bottom + 2 ||
              r.left < main.left - 2 ||
              r.right > main.right + 2 ||
              e.scrollWidth > e.clientWidth + 3 ||
              (getComputedStyle(e).overflow === "hidden" &&
                e.scrollHeight > e.clientHeight + 3)
            );
          })
          .map((e) => e.textContent?.slice(0, 80));
      });
      expect(failures, `Conteúdo cortado no slide ${slide}`).toEqual([]);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollHeight <= innerHeight &&
            document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test("teclado respeita as dez etapas do fluxo e permite repetir", async ({
  page,
}) => {
  await page.goto("/#slide-07");
  await settle(page);
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press(i % 2 ? "Space" : "ArrowRight");
    await expect(page).toHaveURL(/slide-07$/);
  }
  await expect(page.getByText("ETAPA 10 DE 10", { exact: true })).toBeVisible();
  await page.keyboard.press("PageUp");
  await expect(page.getByText("ETAPA 09 DE 10", { exact: true })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/slide-08$/);
  await page.keyboard.press("ArrowLeft");
  await settle(page);
  await expect(page.getByText("ETAPA 01 DE 10", { exact: true })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page).toHaveURL(/slide-01$/);
  await page.keyboard.press("End");
  await expect(page).toHaveURL(/slide-17$/);
});
test("demonstração funciona pelos controles e reinicia sem sair do slide", async ({
  page,
}) => {
  await page.goto("/#slide-14");
  await settle(page);
  await expect(page.getByText("SIMULAÇÃO DIDÁTICA")).toBeVisible();
  for (let i = 0; i < 6; i++) await page.locator(".demo-action").click();
  await expect(page.getByRole("heading", { name: "Olá, Ana." })).toBeVisible();
  await expect(page).toHaveURL(/slide-14$/);
  await page.getByRole("button", { name: "Recomeçar demonstração" }).click();
  await expect(
    page.getByRole("heading", { name: "Bem-vindo de volta." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Próximo", exact: true }).click();
  await expect(page).toHaveURL(/slide-14$/);
});
test("notas, índice, ajuda, foco e hash persistem", async ({ page }) => {
  await page.goto("/#slide-05");
  await settle(page);
  await page.reload();
  await settle(page);
  await expect(page).toHaveURL(/slide-05$/);
  await page.keyboard.press("n");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Possível pergunta do professor")).toBeVisible();
  await expect(page.getByText("Total: 25:00")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Índice de slides (G)" }).click();
  await page.getByRole("button", { name: /17 Uma identidade externa/ }).click();
  await expect(page).toHaveURL(/slide-17$/);
  await settle(page);
  await page.keyboard.press("?");
  await expect(
    page.getByRole("heading", { name: "No seu ritmo." }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Anterior", exact: true }).click();
  await expect(page).toHaveURL(/slide-16$/);
  await page.goBack();
  await settle(page);
  await expect(page).toHaveURL(/slide-17$/);
});
test("toque avança e volta sem rolagem vertical", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4173/#slide-03");
  await settle(page);
  const session = await context.newCDPSession(page);
  async function swipe(from: number, to: number) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: from, y: 350 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: to, y: 352 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(320, 70);
  await expect(page).toHaveURL(/slide-04$/);
  await settle(page);
  await swipe(70, 320);
  await expect(page).toHaveURL(/slide-03$/);
  await context.close();
});
test("Fullscreen API entra e sai com F e trata indisponibilidade", async ({
  page,
}) => {
  await page.goto("/");
  await settle(page);
  await page.keyboard.press("f");
  await expect
    .poll(() => page.evaluate(() => !!document.fullscreenElement))
    .toBe(true);
  await page.keyboard.press("f");
  await expect
    .poll(() => page.evaluate(() => !!document.fullscreenElement))
    .toBe(false);
  await page.evaluate(() => {
    document.documentElement.requestFullscreen = () =>
      Promise.reject(new Error("Indisponível"));
  });
  await page.keyboard.press("f");
  await expect(page.getByRole("status")).toContainText("continua funcionando");
});
test("produção recarrega offline e mantém todos os recursos locais", async ({
  page,
  context,
}) => {
  const remote: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://localhost:4173") &&
      !r.url().startsWith("data:")
    )
      remote.push(r.url());
  });
  await page.goto("/#slide-11");
  await settle(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await settle(page);
  await expect(
    page.getByRole("heading", {
      name: "Pouca configuração. No lugar certo.",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("End");
  await settle(page);
  await expect(
    page.getByRole("heading", { name: "Obrigado!", exact: true }),
  ).toBeVisible();
  expect(remote).toEqual([]);
});

test("copiar o código preserva o texto original", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#slide-11");
  await settle(page);
  await page
    .getByRole("button", { name: "Copiar terminal", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("composer require laravel/socialite");
  await expect(
    page.getByRole("status").filter({ hasText: "Copiado" }),
  ).toBeVisible();
});
