const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');

const root = path.resolve(__dirname, '../site');
const browserPath = process.env.BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => fs.existsSync(p));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  assert.ok(browserPath, 'Set BROWSER_PATH to an installed Chrome/Edge executable');
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end(); return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
    res.setHeader('Content-Type', (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
    const page = await browser.newPage();
    const base = `http://127.0.0.1:${server.address().port}`;
    const errors = [], external = [], assets = new Set();
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure().errorText}`));
    page.on('request', request => {
      if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== base) external.push(request.url());
    });
    page.on('response', response => {
      if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${response.url()}`);
      if (response.ok()) assets.add(new URL(response.url()).pathname);
    });
    await page.setViewport({ width: 1366, height: 1000 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('a[href="jeeprescue/"]');
    await page.waitForFunction(() => window.jeepRescue?.game.mode === 'ready');
    assert.equal(new URL(page.url()).pathname, '/jeeprescue/');
    assert.match(await page.title(), /Jeep Rescue/);
    await page.waitForNetworkIdle();
    for (const file of ['index', 'main.js', 'engine.js', 'renderer.js', 'style.css']) {
      assert.ok(assets.has('/jeeprescue/' + (file === 'index' ? '' : file)), `Loaded ${file} under subpath`);
    }
    // Chromium may not request a favicon in headless mode; check the declared asset directly.
    assert.equal(await page.$eval('link[rel="icon"]', async node => (await fetch(node.href)).status), 200);
    await page.click('#start');
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'playing');
    assert.equal(await page.$eval('#overlay', node => node.hidden), true);
    const beforeX = await page.evaluate(() => window.jeepRescue.game.player.x);
    await page.keyboard.down('ArrowRight');
    await delay(250);
    await page.keyboard.up('ArrowRight');
    assert.ok(await page.evaluate(x => window.jeepRescue.game.player.x > x, beforeX));
    await page.keyboard.press('Space');
    await page.waitForFunction(() => window.jeepRescue.game.bullets.length > 0);
    // Leave the rearming zone before checking grenade consumption.
    await page.keyboard.down('ArrowUp');
    await page.waitForFunction(() => window.jeepRescue.game.player.y < 1900);
    await page.keyboard.up('ArrowUp');
    await page.keyboard.press('KeyX');
    await page.waitForFunction(() => window.jeepRescue.game.player.grenades === 5);
    assert.equal(await page.$eval('#grenades', node => node.textContent), '5');
    await page.keyboard.press('KeyP');
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'paused');
    const pausedTime = await page.evaluate(() => window.jeepRescue.game.time);
    await delay(150);
    assert.equal(await page.evaluate(() => window.jeepRescue.game.time), pausedTime);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'playing');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'paused');
    await page.click('#start');
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'playing');
    await page.click('#restart');
    assert.equal(await page.$eval('#overlay-tag', node => node.textContent), 'RESTART MISSION?');
    assert.equal(await page.evaluate(() => window.jeepRescue.game.mode), 'paused');
    await page.click('#start');
    await page.waitForFunction(() => window.jeepRescue.game.mode === 'playing');
    assert.equal(await page.evaluate(() => window.jeepRescue.game.player.grenades), 6);
    assert.equal(await page.$eval('#rescued', node => node.textContent), '0');
    await page.click('#sound');
    assert.equal(await page.$eval('#sound', node => node.getAttribute('aria-pressed')), 'false');
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('#sound', node => node.getAttribute('aria-pressed')), 'false');
    for (const width of [1366, 390]) {
      await page.setViewport({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `No overflow at ${width}px`);
    }
    assert.deepEqual(external, [], 'All runtime assets are served locally');
    assert.deepEqual(errors, [], 'No browser errors or missing assets');
    console.log('Jeep Rescue browser checks passed (entry, local assets, controls, restart, storage, layout).');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
