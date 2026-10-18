const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const puppeteer = require("puppeteer-core");

const root = path.resolve(__dirname, "../site");
const browserPath =
  process.env.BROWSER_PATH ||
  [
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].find((p) => fs.existsSync(p));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function screenshot(page, name) {
  if (!process.env.SCREENSHOT_DIR) return;
  fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(process.env.SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  });
}

async function main() {
  assert.ok(
    browserPath,
    "Set BROWSER_PATH to an installed Chrome/Edge executable",
  );
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = path.resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    const types = {
      ".html": "text/html",
      ".mjs": "text/javascript",
      ".js": "text/javascript",
      ".css": "text/css",
      ".svg": "image/svg+xml",
    };
    res.setHeader(
      "Content-Type",
      (types[path.extname(file)] || "application/octet-stream") +
        "; charset=utf-8",
    );
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true,
    });
    const errors = [];
    const watch = (page) => {
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400 && !r.url().endsWith("/favicon.ico"))
          errors.push(`${r.status()} ${r.url()}`);
      });
    };
    const base = `http://127.0.0.1:${server.address().port}`;
    const page = await browser.newPage();
    watch(page);
    await page.setViewport({ width: 1366, height: 1000 });
    await page.goto(base, { waitUntil: "networkidle0" });
    await page.click('a[href="piano-rhythm/"]');
    await page.waitForSelector(".song-card");
    assert.equal(await page.$$eval(".song-card", (nodes) => nodes.length), 4);
    assert.equal(await page.$eval("#hit-pad", (node) => node.disabled), true);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await screenshot(page, "rhythm-desktop");
    await page.click("#start");
    await page.waitForSelector('#stage[data-phase="countin"]');
    // Count-in presses are harmless; holding Space cannot generate a stream of hits.
    await page.keyboard.press("Space");
    assert.equal(
      await page.$eval("#score", (node) => node.textContent),
      "000000",
    );
    await page.waitForSelector('#stage[data-phase="playing"]');
    await page.keyboard.down("Space");
    await page.keyboard.down("Space");
    await page.keyboard.up("Space");
    assert.match(
      await page.$eval("#feedback strong", (node) => node.textContent),
      /PERFECT|GOOD/,
    );
    assert.match(await page.$eval("#combo", (node) => node.textContent), /^1/);
    const afterHit = await page.$eval("#score", (node) => node.textContent);
    await page.click("#pause");
    await page.waitForSelector('#stage[data-phase="paused"]');
    await delay(800);
    assert.equal(
      await page.$eval("#score", (node) => node.textContent),
      afterHit,
    );
    await page.click("#pause");
    await page.waitForSelector('#stage[data-phase="playing"]');
    await page.waitForFunction(
      () => document.querySelector("#feedback strong").textContent === "MISS",
    );
    await screenshot(page, "rhythm-desktop-playing");
    await page.evaluate(() => window.dispatchEvent(new Event("blur")));
    await page.waitForSelector('#stage[data-phase="paused"]');
    await page.click("#back");
    await page.waitForSelector('#stage[data-phase="ready"]');
    assert.equal(
      await page.$eval("#score", (node) => node.textContent),
      "000000",
    );
    await page.click('[data-song="elise"]');
    assert.match(
      await page.$eval("#song-title", (node) => node.textContent),
      /致爱丽丝/,
    );
    await page.select("#speed", "0.75");
    assert.equal(await page.$eval("#bpm", (node) => node.textContent), "54");
    await page.click("#mute");
    assert.equal(
      await page.$eval("#mute", (node) => node.getAttribute("aria-pressed")),
      "true",
    );

    const mobile = await browser.newPage();
    watch(mobile);
    await mobile.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await mobile.goto(base + "/piano-rhythm/", { waitUntil: "networkidle0" });
    await screenshot(mobile, "rhythm-mobile");
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await mobile.tap("#start");
    await mobile.waitForSelector('#stage[data-phase="playing"]');
    const box = await mobile.$eval("#hit-pad", (node) => {
      const b = node.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2, bottom: b.bottom };
    });
    assert.ok(
      box.bottom <= 844,
      "touch pad must fit in the active portrait viewport",
    );
    await mobile.touchscreen.touchStart(box.x, box.y);
    await delay(70);
    await mobile.touchscreen.touchEnd();
    assert.match(
      await mobile.$eval("#feedback strong", (node) => node.textContent),
      /PERFECT|GOOD/,
    );
    assert.match(
      await mobile.$eval("#combo", (node) => node.textContent),
      /^1/,
    );
    await screenshot(mobile, "rhythm-mobile-playing");
    // One more early tap is a wrong beat, with an explicit red/error state.
    await mobile.tap("#hit-pad");
    assert.equal(
      await mobile.$eval("#hit-pad", (node) => node.dataset.judgment),
      "stray",
    );
    await mobile.tap("#pause");
    await mobile.waitForSelector('#stage[data-phase="paused"]');
    await mobile.tap("#back");
    await mobile.tap('[data-song="minuet"]');
    await mobile.select("#speed", "1.25");
    await mobile.tap("#start");
    // Finish a complete real-audio session without input, then retry and reset.
    await mobile.waitForSelector("#results[open]", { timeout: 30000 });
    assert.equal(
      await mobile.$eval("#result-score", (node) => node.textContent),
      "0",
    );
    assert.equal(await mobile.$eval("#grade", (node) => node.textContent), "D");
    assert.equal(
      await mobile.$eval("#result-accuracy", (node) => node.textContent),
      "0.0%",
    );
    await screenshot(mobile, "rhythm-mobile-results");
    await mobile.tap("#retry");
    await mobile.waitForSelector('#stage[data-phase="countin"]');
    await mobile.tap("#back");
    await mobile.waitForSelector('#stage[data-phase="ready"]');
    assert.equal(await mobile.evaluate(() => localStorage.length), 0);
    assert.deepEqual(await mobile.evaluate(() => indexedDB.databases()), []);
    await mobile.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await mobile.setViewport({
      width: 320,
      height: 740,
      isMobile: true,
      hasTouch: true,
    });
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: desktop Space, repeat protection, audio clock, pause/resume/blur, touch down, portrait fit, wrong/missed feedback, full result/retry, no history.",
    );
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
