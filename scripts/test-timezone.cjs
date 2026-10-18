// Uses a local Chrome/Edge and an ephemeral localhost-only static server.
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
async function main() {
  assert.ok(browserPath, 'Set BROWSER_PATH to an installed Chrome/Edge');
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.mjs': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
    const page = await browser.newPage();
    const errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:') && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('a[href="timezone/"]');
    await page.waitForSelector('.timeline-row');
    assert.equal(await page.$$eval('.member', els => els.length), 3);
    assert.equal(await page.$$eval('.clock-card', els => els.length), 22);
    for (const [query, zone] of [
      ['海德拉巴', 'Asia/Kolkata'], ['Hyderabad', 'Asia/Kolkata'],
      ['塔林', 'Europe/Tallinn'], ['Tallinn', 'Europe/Tallinn'],
      ['布拉格', 'Europe/Prague'], ['Prague', 'Europe/Prague'],
      ['redmond', 'America/Los_Angeles'], ['雷德蒙德', 'America/Los_Angeles'],
      ['太平洋', 'America/Los_Angeles'],
    ]) {
      await page.$eval('#zone-search', (el, value) => { el.value = value; el.dispatchEvent(new Event('input')); }, query);
      assert.ok(await page.$(`.clock-card[data-zone="${zone}"]`), `${query} finds ${zone}`);
      await page.click(`.clock-card[data-zone="${zone}"]`);
      assert.ok(await page.$(`.member[data-zone="${zone}"]`), `${query} can join collaboration`);
      await page.click(`.member[data-zone="${zone}"] .remove`);
    }
    await page.$eval('#zone-search', el => { el.value = ''; el.dispatchEvent(new Event('input')); });
    const clock = await page.$eval('#local-time', el => el.textContent);
    await page.waitForFunction(previous => document.querySelector('#local-time').textContent !== previous, {}, clock);

    const setDate = value => page.$eval('#meeting-date', (input, v) => { input.value = v; input.dispatchEvent(new Event('change', { bubbles: true })); }, value);
    await setDate('2026-07-15');
    assert.equal(await page.$$eval('.result-card', els => els.length), 1);
    assert.match(await page.$eval('.result-times', el => el.textContent), /19:00 – 20:00/);
    // Clipboard output includes local dates and IANA zone names.
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.copiedText = text; } } }));
    await page.click('.copy');
    assert.match(await page.evaluate(() => window.copiedText), /Asia\/Shanghai.*2026-07-15 UTC\+8 19:00/);
    await setDate('2026-01-15');
    assert.equal(await page.$$eval('.result-card', els => els.length), 0);
    assert.match(await page.$eval('#overlap-results', el => el.textContent), /暂未交汇/);

    await page.click('.clock-card[data-zone="Asia/Tokyo"]');
    assert.equal(await page.$$eval('.member', els => els.length), 4);
    assert.ok(await page.$eval('.clock-card[data-zone="Europe/Paris"]', el => el.disabled));
    await page.click('.member[data-zone="Asia/Tokyo"] .remove');
    await page.click('.member[data-zone="America/New_York"] .remove');
    await page.click('.member[data-zone="Europe/London"] .remove');
    assert.equal(await page.$$eval('.member', els => els.length), 2);
    assert.match(await page.$eval('#notice', el => el.textContent), /至少保留 2/);

    await page.type('#zone-search', 'Kathmandu');
    assert.ok(await page.$('.clock-card[data-zone="Asia/Katmandu"], .clock-card[data-zone="Asia/Kathmandu"]'), 'quarter-hour zone searchable');
    // Some Intl versions use the legacy spelling Katmandu, so search Tokyo for adding.
    await page.$eval('#zone-search', el => { el.value = 'Tokyo'; el.dispatchEvent(new Event('input')); });
    await page.click('.clock-card[data-zone="Asia/Tokyo"]');
    await page.$eval('#zone-search', el => { el.value = 'not-a-zone'; el.dispatchEvent(new Event('input')); });
    assert.ok(await page.$('.no-clocks'));
    await page.$eval('#zone-search', el => { el.value = ''; el.dispatchEvent(new Event('input')); });
    const setTime = (field, value) => page.$eval(`.member[data-zone="Asia/Shanghai"] input[data-field="${field}"]`, (el, v) => { el.value = v; el.dispatchEvent(new Event('change')); }, value);
    await setTime('start', '22:15');
    await setTime('end', '02:15');
    assert.match(await page.$eval('.timeline', el => el.textContent), /跨午夜/);
    await page.evaluate(() => localStorage.setItem('unrelated_setting', 'keep'));
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('.member[data-zone="Asia/Shanghai"] input[data-field="start"]', el => el.value), '22:15');
    assert.equal(await page.evaluate(() => localStorage.getItem('unrelated_setting')), 'keep');

    // Reproduce a visible overlap for desktop / mobile layout inspection.
    await setTime('start', '07:00'); await setTime('end', '20:00');
    await setDate('2026-07-15');
    if (process.env.SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'timezone-desktop.png'), fullPage: true });
    }
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no mobile page overflow');
    await page.click('#find-button');
    assert.ok(await page.$('.result-card'));
    if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'timezone-mobile.png'), fullPage: true });
    // Disabled storage and malformed saved settings must degrade gracefully.
    await page.evaluate(() => localStorage.setItem('heavenrepo.timezone.v1', '{bad json'));
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$$eval('.member', els => els.length), 3);
    await page.evaluateOnNewDocument(() => {
      Storage.prototype.getItem = () => { throw new Error('storage blocked'); };
      Storage.prototype.setItem = () => { throw new Error('storage blocked'); };
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.click('.clock-card[data-zone="Asia/Tokyo"]');
    assert.equal(await page.$$eval('.member', els => els.length), 4);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    console.log('PASS: live clocks, overlap/empty states, date conversion, copy, 2–4 limits, search, overnight, persistence, mobile, blocked storage, no external requests');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
