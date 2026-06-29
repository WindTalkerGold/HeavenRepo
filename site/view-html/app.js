'use strict';

const fileInput = document.getElementById('file');
const clearBtn = document.getElementById('clear');
const stage = document.getElementById('stage');
const drop = document.getElementById('drop');
const statusEl = document.getElementById('status');
const bar = document.querySelector('.bar');
const toggle = document.getElementById('toggle');

const MIME = {
  html: 'text/html', htm: 'text/html', css: 'text/css', js: 'text/javascript',
  mjs: 'text/javascript', json: 'application/json', svg: 'image/svg+xml',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', ico: 'image/x-icon', bmp: 'image/bmp', avif: 'image/avif',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf',
  mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', mp4: 'video/mp4',
  webm: 'video/webm', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv',
};
const ext = (p) => (p.split('.').pop() || '').toLowerCase();
const mimeOf = (p) => MIME[ext(p)] || 'application/octet-stream';
const isText = (p) => /^(text\/|application\/(json|javascript|xml))/.test(mimeOf(p)) || ext(p) === 'svg';

function setStatus(msg, cls) { statusEl.textContent = msg; statusEl.className = 'status' + (cls ? ' ' + cls : ''); }

// Normalize a zip-relative path: drop leading ./ and "../", resolve, lowercase key.
function norm(path) {
  const parts = [];
  for (const seg of path.replace(/\\/g, '/').split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop(); else parts.push(seg);
  }
  return parts.join('/');
}

function bytesToB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
const dataUrl = (file) => `data:${file.mime};base64,${bytesToB64(file.bytes)}`;

// Build the sandboxed document and load it.
async function render(files, indexKey) {
  const byKey = new Map(files.map((f) => [f.key, f]));
  const indexFile = byKey.get(indexKey);
  const dec = new TextDecoder();
  let html = dec.decode(indexFile.bytes);

  // resolve a ref relative to a base dir into a stored file
  const baseDir = indexKey.includes('/') ? indexKey.slice(0, indexKey.lastIndexOf('/')) : '';
  const resolve = (ref) => byKey.get(norm(baseDir ? baseDir + '/' + ref : ref));

  const inlineCss = (css, dir) => css.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, (m, u) => {
    if (/^(data:|#)/.test(u)) return m;
    const f = byKey.get(norm(dir ? dir + '/' + u : u));
    return f ? `url("${dataUrl(f)}")` : m;
  });

  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('link[rel~="stylesheet"][href]').forEach((l) => {
    const f = resolve(l.getAttribute('href'));
    if (!f) return;
    const s = doc.createElement('style');
    s.textContent = inlineCss(dec.decode(f.bytes), f.key.includes('/') ? f.key.slice(0, f.key.lastIndexOf('/')) : '');
    l.replaceWith(s);
  });
  // Build a self-contained data: URL for a JS module, rewriting import specifiers
  // to dependency data: URLs so ES modules work offline. Memoized + cycle-guarded.
  const jsB64 = (txt) => btoa(unescape(encodeURIComponent(txt)));
  const modCache = new Map();
  const dirOf = (k) => k.includes('/') ? k.slice(0, k.lastIndexOf('/')) : '';
  const moduleUrl = (key) => {
    if (modCache.has(key)) return modCache.get(key);
    const f = byKey.get(key);
    if (!f) return null;
    modCache.set(key, `data:text/javascript;base64,${jsB64(dec.decode(f.bytes))}`); // placeholder for cycles
    const dir = dirOf(key);
    const src = dec.decode(f.bytes).replace(/(\bfrom\s*|\bimport\s*|\bimport\()\s*(['"])([^'"]+)\2/g, (m, kw, q, spec) => {
      if (/^(data:|https?:|\/)/.test(spec)) return m;
      const u = moduleUrl(norm(dir ? dir + '/' + spec : spec));
      return u ? `${kw}${q}${u}${q}` : m;
    });
    const url = `data:text/javascript;base64,${jsB64(src)}`;
    modCache.set(key, url);
    return url;
  };
  const rewriteInlineModule = (code, dir) => code.replace(/(\bfrom\s*|\bimport\s*|\bimport\()\s*(['"])([^'"]+)\2/g, (m, kw, q, spec) => {
    if (/^(data:|https?:|\/)/.test(spec)) return m;
    const u = moduleUrl(norm(dir ? dir + '/' + spec : spec));
    return u ? `${kw}${q}${u}${q}` : m;
  });
  doc.querySelectorAll('script').forEach((sc) => {
    const isMod = sc.type === 'module';
    const ref = sc.getAttribute('src');
    if (ref) {
      const f = resolve(ref);
      if (!f) { sc.remove(); return; }
      if (isMod) { sc.setAttribute('src', moduleUrl(f.key)); return; }
      const n = doc.createElement('script'); if (sc.type) n.type = sc.type; n.textContent = dec.decode(f.bytes); sc.replaceWith(n);
    } else if (isMod && sc.textContent.trim()) {
      sc.textContent = rewriteInlineModule(sc.textContent, baseDir);
    }
  });
  doc.querySelectorAll('[src], [href], [poster]').forEach((el) => {
    if (el.tagName === 'SCRIPT') return;
    for (const a of ['src', 'href', 'poster']) {
      const v = el.getAttribute(a);
      if (!v || /^(data:|#|mailto:)/.test(v)) continue;
      const f = resolve(v);
      if (f) el.setAttribute(a, dataUrl(f));
      else if (el.tagName !== 'A') el.removeAttribute(a);
    }
  });
  doc.querySelectorAll('style').forEach((s) => { s.textContent = inlineCss(s.textContent, baseDir); });

  // In-memory map for the fetch/XHR shim: relative path -> {mime, text|b64}
  const map = {};
  for (const f of files) map[f.key] = isText(f.key) ? { mime: f.mime, text: dec.decode(f.bytes) } : { mime: f.mime, b64: bytesToB64(f.bytes) };
  const shim = `<script>(${shimSrc})(${JSON.stringify(map).replace(/</g, '\\u003c')},${JSON.stringify(baseDir)});<\/script>`;
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' data:; style-src 'unsafe-inline' data:; img-src data:; font-src data:; media-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  doc.head.insertAdjacentHTML('afterbegin', csp + shim);

  stage.srcdoc = '<!DOCTYPE html>' + doc.documentElement.outerHTML;
  stage.hidden = false; drop.hidden = true; clearBtn.hidden = false;
  bar.classList.add('collapsed'); toggle.hidden = false;
  setStatus(`Rendered ${indexKey} (${files.length} files). Network blocked.`, 'ok');
}

// Runs inside the sandbox: serve relative reads from memory, never the network.
function shimSrc(MAP, BASE) {
  const norm = (p) => { const o = []; for (const s of (p || '').split('/')) { if (!s || s === '.') continue; s === '..' ? o.pop() : o.push(s); } return o.join('/'); };
  const find = (u) => MAP[norm(BASE ? BASE + '/' + u : u)] || MAP[norm(u)];
  const body = (f) => f.text != null ? f.text : Uint8Array.from(atob(f.b64), (c) => c.charCodeAt(0));
  const dataUrl = (f) => 'data:' + f.mime + ';base64,' + (f.b64 != null ? f.b64 : btoa(unescape(encodeURIComponent(f.text))));
  const map = (u) => { if (!u || /^(data:|#|mailto:)/.test(u)) return null; const f = find(String(u).replace(/[?#].*$/, '')); return f ? dataUrl(f) : null; };
  // Rewrite src/href on dynamically created elements to in-package data: URLs.
  const ce = Document.prototype.createElement;
  Document.prototype.createElement = function () {
    const el = ce.apply(this, arguments);
    for (const a of ['src', 'href']) {
      const d = Object.getOwnPropertyDescriptor(el.__proto__, a) || Object.getOwnPropertyDescriptor(HTMLElement.prototype, a);
      if (!d || !d.set) continue;
      Object.defineProperty(el, a, { configurable: true, get() { return d.get.call(el); }, set(v) { d.set.call(el, map(v) || v); } });
    }
    const sa = el.setAttribute;
    el.setAttribute = function (n, v) { return sa.call(el, n, (n === 'src' || n === 'href') ? (map(v) || v) : v); };
    return el;
  };
  window.fetch = (input) => { const f = find(String(input).replace(/[?#].*$/, '')); return f ? Promise.resolve(new Response(body(f), { status: 200, headers: { 'Content-Type': f.mime } })) : Promise.reject(new TypeError('blocked: ' + input)); };
  const RX = window.XMLHttpRequest;
  window.XMLHttpRequest = function () { const x = new RX(); const o = x.open; x.open = function (m, u) { x.__u = String(u).replace(/[?#].*$/, ''); return o.apply(x, [m, 'data:,', true]); }; x.send = function () { const f = find(x.__u); setTimeout(() => { Object.defineProperty(x, 'responseText', { value: f ? (f.text || atob(f.b64)) : '' }); Object.defineProperty(x, 'status', { value: f ? 200 : 0 }); Object.defineProperty(x, 'readyState', { value: 4 }); x.onreadystatechange && x.onreadystatechange(); x.onload && x.onload(); }); }; return x; };
}

async function loadZip(buf) {
  setStatus('Extracting…');
  const zip = await JSZip.loadAsync(buf);
  const files = [];
  await Promise.all(Object.values(zip.files).map(async (e) => { if (e.dir) return; files.push({ key: norm(e.name), bytes: await e.async('uint8array'), mime: mimeOf(e.name) }); }));
  if (!files.length) throw new Error('Empty package.');
  let idx = files.find((f) => /(^|\/)index\.html?$/.test(f.key)) || files.find((f) => /\.html?$/.test(f.key));
  if (!idx) throw new Error('No index.html found in package.');
  files.sort((a, b) => a.key.length - b.key.length);
  await render(files, files.find((f) => f.key === idx.key).key);
}

function handle(file) {
  if (!file) return;
  setStatus(`Reading ${file.name}…`);
  file.arrayBuffer().then(loadZip).catch((e) => setStatus('Error: ' + e.message, 'err'));
}

fileInput.addEventListener('change', (e) => handle(e.target.files[0]));
clearBtn.addEventListener('click', () => { stage.srcdoc = ''; stage.hidden = true; drop.hidden = false; clearBtn.hidden = true; fileInput.value = ''; bar.classList.remove('collapsed'); toggle.hidden = true; setStatus(''); });
toggle.addEventListener('click', () => bar.classList.toggle('collapsed'));
['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (e) => handle(e.dataTransfer.files[0]));
