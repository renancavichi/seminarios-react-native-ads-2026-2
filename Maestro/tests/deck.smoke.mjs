/**
 * Teste de fumaça do deck.
 *
 * Não valida design — valida que a apresentação sobe sem erro de console,
 * que os 20 slides carregam, que a navegação funciona e que as interações
 * dos slides respondem. É o que impede subir para o GitHub uma apresentação
 * que quebra no dia do seminário.
 *
 *   node tests/deck.smoke.mjs
 *
 * Requer um servidor em http://localhost:8731 servindo apps/deck
 * (ou defina DECK_URL).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_SLIDES = 20;
// Porta 0 = o sistema escolhe uma livre, então um servidor esquecido rodando
// noutro terminal não faz o teste falhar.
const PORT = Number(process.env.DECK_PORT ?? 0);
const DECK_ROOT = fileURLToPath(new URL('../apps/deck/', import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

/**
 * Sobe um servidor estático mínimo para o deck.
 *
 * O teste serve a si mesmo para que `npm test` funcione num clone recém-feito
 * e no CI, sem depender de um servidor já rodando em outro terminal.
 */
function startServer() {
  const server = createServer(async (req, res) => {
    // Remove a query e impede sair da raiz do deck com "..".
    const path = normalize(decodeURIComponent(req.url.split('?')[0]));
    const file = join(DECK_ROOT, path === '/' ? 'index.html' : path);

    if (!file.startsWith(DECK_ROOT)) {
      res.writeHead(403).end('forbidden');
      return;
    }

    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const server = await startServer();
const BASE_URL = `http://localhost:${server.address().port}`;

const checks = [];
const check = (name, passed, detail = '') => {
  checks.push({ name, passed, detail });
  console.log(`${passed ? 'PASS' : 'FALHA'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

// --- carregamento ---------------------------------------------------------
const slideCount = await page.locator('section.slide').count();
check('todos os slides carregam', slideCount === EXPECTED_SLIDES, `${slideCount} de ${EXPECTED_SLIDES}`);

const visible = await page.locator('section.slide.on').count();
check('exatamente um slide visível', visible === 1, `${visible} visíveis`);

check('sem tela de erro fatal', (await page.locator('.fatal').count()) === 0);

// --- moldura --------------------------------------------------------------
check('rodapé mostra o título', (await page.locator('#label').textContent()) === 'Capa');
check('contador inicia em 1', (await page.locator('#count').textContent()) === `1 / ${EXPECTED_SLIDES}`);
check('marcadores criados', (await page.locator('#dots .dot').count()) === EXPECTED_SLIDES);
check('botão "anterior" inativo no slide 1', await page.locator('#bPrev').isDisabled());

// --- navegação ------------------------------------------------------------
await page.keyboard.press('ArrowRight');
check('seta avança', (await page.locator('#count').textContent()) === `2 / ${EXPECTED_SLIDES}`);
check('URL reflete o slide', page.url().endsWith('#/2'), page.url().slice(-6));

await page.keyboard.press('ArrowLeft');
check('seta retrocede', (await page.locator('#count').textContent()) === `1 / ${EXPECTED_SLIDES}`);

await page.keyboard.press('ArrowLeft');
check('não passa do primeiro slide', (await page.locator('#count').textContent()) === `1 / ${EXPECTED_SLIDES}`);

await page.keyboard.press('End');
check('End vai ao último', (await page.locator('#count').textContent()) === `${EXPECTED_SLIDES} / ${EXPECTED_SLIDES}`);
check('botão "próximo" inativo no fim', await page.locator('#bNext').isDisabled());
await page.keyboard.press('Home');

// --- panorama -------------------------------------------------------------
await page.keyboard.press('o');
check('panorama abre', await page.locator('#overview.on').isVisible());
check('panorama lista os slides', (await page.locator('.ov-item').count()) === EXPECTED_SLIDES);
await page.locator('.ov-item').nth(11).click();
check('clique no panorama navega', (await page.locator('#count').textContent()) === `12 / ${EXPECTED_SLIDES}`);
check('panorama fecha ao escolher', !(await page.locator('#overview.on').isVisible()));

// --- interações dos slides ------------------------------------------------
await page.goto(`${BASE_URL}/index.html#/4`, { waitUntil: 'networkidle' });
const shownPain = await page.locator('[data-panel="pain"]:not([hidden])').count();
check('slide de dores: 1 painel exibido', shownPain === 1, `${shownPain} exibidos`);
await page.locator('[data-group="pain"][data-value="sleep"]').click();
check('trocar a dor troca o painel',
  await page.locator('[data-panel="pain"][data-value="sleep"]').isVisible());
check('rótulo do arquivo acompanha',
  (await page.locator('[data-label-for="pain"]').textContent()) === 'espera-na-marra.js');

await page.goto(`${BASE_URL}/index.html#/10`, { waitUntil: 'networkidle' });
check('anatomia: linhas destacadas no início',
  (await page.locator('[data-highlight="an"].hl').count()) > 0);
await page.locator('[data-group="an"][data-value="opt"]').click();
const optLines = await page.locator('[data-highlight="an"][data-value="opt"].hl').count();
check('escolher item acende as linhas certas', optLines === 3, `${optLines} linhas`);

await page.goto(`${BASE_URL}/index.html#/11`, { waitUntil: 'networkidle' });
await page.locator('.el[data-el="pass"]').click();
check('celular: tocar acende o código',
  (await page.locator('[data-el-line="pass"].hl').count()) > 0);

await page.goto(`${BASE_URL}/index.html#/9`, { waitUntil: 'networkidle' });
const paneBefore = await page.locator('.pane.on').first().getAttribute('data-tab');
await page.locator('.tabs[data-tabs] .tab').nth(1).click();
const paneAfter = await page.locator('.pane.on').first().getAttribute('data-tab');
check('abas trocam de painel', paneBefore !== paneAfter, `${paneBefore} → ${paneAfter}`);

await page.goto(`${BASE_URL}/index.html#/17`, { waitUntil: 'networkidle' });
await page.locator('#runTest').click();
await page.waitForTimeout(300);
check('terminal imprime a execução', (await page.locator('#term .term-line').count()) > 5);

// --- resultado ------------------------------------------------------------
check('nenhum erro de console', consoleErrors.length === 0, consoleErrors.join(' | '));

await browser.close();
server.close();

const failed = checks.filter((c) => !c.passed);
console.log(`\n${checks.length - failed.length}/${checks.length} verificações passaram.`);
process.exit(failed.length === 0 ? 0 : 1);
