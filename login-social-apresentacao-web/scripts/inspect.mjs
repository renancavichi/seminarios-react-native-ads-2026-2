/* global document */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const problems = [];
for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  page.on("pageerror", (error) =>
    problems.push({ viewport, error: String(error) }),
  );
  await page.goto("http://localhost:5173/");
  await page.evaluate(() => document.fonts.ready);
  for (let i = 1; i <= 17; i++) {
    await page.goto(
      `http://localhost:5173/#slide-${String(i).padStart(2, "0")}`,
    );
    await page.waitForTimeout(380);
    if (i === 7)
      for (let s = 0; s < 9; s++) await page.keyboard.press("ArrowRight");
    if (i === 14)
      for (let s = 0; s < 6; s++) await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(() => {
      const main = document.querySelector("main").getBoundingClientRect();
      const elements = [
        ...document.querySelectorAll(
          "main h1,main h2,main h3,main p,main pre,main button,main .callout,main table,main .references,main .identity-art,main .demo-banner,main .provider-table,main .code-window",
        ),
      ];
      return elements
        .map((e) => {
          const r = e.getBoundingClientRect();
          return {
            tag: e.tagName,
            text: e.textContent.slice(0, 65),
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            sw: e.scrollWidth,
            cw: e.clientWidth,
            sh: e.scrollHeight,
            ch: e.clientHeight,
          };
        })
        .filter(
          (r) =>
            r.bottom > main.bottom + 2 ||
            r.top < main.top - 2 ||
            r.left < main.left - 2 ||
            r.right > main.right + 2 ||
            r.sw > r.cw + 3 ||
            ((r.tag === "FIGURE" || r.text.startsWith("ProvedorIntegração")) &&
              r.sh > r.ch + 3),
        );
    });
    if (overflow.length) problems.push({ viewport, slide: i, overflow });
    await page.screenshot({
      path: `.artifacts/slide-${String(i).padStart(2, "0")}-${viewport.width}.png`,
    });
  }
  await page.close();
}
await writeFile(
  ".artifacts/layout-report.json",
  JSON.stringify(problems, null, 2),
);
console.log(JSON.stringify(problems, null, 2));
await browser.close();
