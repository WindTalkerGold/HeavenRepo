// Browser smoke/regression tests. Uses an installed Edge/Chrome, not a downloaded browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
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
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    res.setHeader('Content-Type', (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('a[href="typing/"]');
    await page.waitForSelector('#menu .stage-card');
    assert.equal(await page.$$eval('#menu .stage-card', els => els.length), 6);
    assert.equal(await page.evaluate(() => Object.keys(window.NOTE_MAP).length), 36);

    // Complete a real keyboard-driven round, including transition-time duplicate input.
    await page.click('#menu .stage-card');
    await page.keyboard.press('!');
    assert.equal(await page.evaluate(() => itemPenalty), 500);
    await page.evaluate(() => {
      queue[1] = queue[0];
      handleReact(queue[0]);
      handleReact(queue[0]);
    });
    assert.equal(await page.evaluate(() => qIdx), 1, 'duplicate input during transition must be ignored');
    await delay(250);
    for (let i = 1; i < 20; i++) {
      const key = await page.evaluate(() => queue[qIdx]);
      await page.keyboard.press(key);
      await page.waitForFunction(index => qIdx === index + 1, {}, i);
      await delay(230);
    }
    assert.ok(await page.$('#results.active'));
    assert.equal(await page.evaluate(() => scores[1].length), 10);
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.evaluate(() => scores[1].length), 10, 'scores survive reload');

    // Cancel a pending transition and verify it cannot restart the practice timer.
    await page.click('#menu .stage-card');
    await page.evaluate(() => { handleReact(queue[0]); renderMenu(); });
    await delay(300);
    assert.equal(await page.evaluate(() => timerInterval), null);
    assert.equal(await page.evaluate(() => practiceEl.classList.contains('active')), false);

    // Case-sensitive letters/symbols: wrong case is penalized, exact input advances.
    await page.click('#menu .stage-card:nth-child(2)');
    await page.evaluate(() => { queue = ['A', '!']; qIdx = 0; nextItem(); });
    await page.keyboard.type('a');
    assert.equal(await page.evaluate(() => itemPenalty), 500);
    assert.equal(await page.evaluate(() => qIdx), 0);
    await page.keyboard.type('A');
    await delay(250);
    await page.keyboard.type('!');
    await page.waitForSelector('#results.active');
    await page.click('#btnResBack');

    // Word/sentence input, including Space after clicking the restart button.
    for (const stage of [3, 4]) {
      await page.click(`#menu .stage-card:nth-child(${stage})`);
      await page.click('#btnAgain');
      await page.evaluate(() => { queue = ['a b']; qIdx = 0; nextItem(); });
      await page.keyboard.type('a b');
      await page.waitForSelector('#results.active');
      await page.click('#btnResBack');
    }

    // Exercise both Chinese pools and IME composition/input de-duplication.
    for (const stage of [5, 6]) {
      await page.click(`#menu .stage-card:nth-child(${stage})`);
      assert.ok(await page.evaluate(() => typeof queue[0] === 'string' && queue[0].length > 0));
      await page.evaluate(() => {
        const target = queue[0];
        imeInput.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
        imeInput.value = target;
        imeInput.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
        if (qIdx !== 0) throw new Error('composition accepted too early');
        imeInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
        imeInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
        checkIme();
      });
      assert.equal(await page.evaluate(() => qIdx), 1);
      await page.click('#btnBack');
      await delay(300);
      assert.equal(await page.evaluate(() => timerInterval), null);
    }

    await page.click('#btnNoteChart');
    assert.equal(await page.$$eval('.nc-cell', els => els.length), 36);
    await page.keyboard.press('A');
    assert.ok(await page.$('.nc-cell[data-key="A"].playing'));
    await page.click('#btnPlayScale');
    await page.evaluate(() => renderMenu());
    assert.equal(await page.evaluate(() => scaleTimer), null);
    await page.click('#btnSound');
    const enabled = await page.evaluate(() => window.SoundFX.enabled);
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.evaluate(() => window.SoundFX.enabled), enabled);
    await page.click('#btnLeaderboard');
    assert.ok(await page.$('#leaderboard.active table'));

    // Static files also work without a local web server.
    await page.goto(pathToFileURL(path.join(root, 'typing/index.html')).href, { waitUntil: 'load' });
    assert.equal(await page.$$eval('#menu .stage-card', els => els.length), 6);
    assert.deepEqual(errors, []);
    console.log('PASS: menu, sound/staff, round completion, penalties, persistence, words/sentences, IME, transitions, leaderboard, file://');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
