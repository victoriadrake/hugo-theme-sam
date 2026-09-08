const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright-core');
const root = path.resolve(__dirname, '..');
let temporary, server, browser, baseURL;

before(async () => {
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sam-browser-'));
  const theme = path.join(temporary, 'sam');
  const excluded = new Set(['.git', 'node_modules', 'resources', '.hugo-resources', 'docs', 'public', '__pycache__']);
  fs.cpSync(root, theme, { recursive: true, filter: source => !excluded.has(path.basename(source)) });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(theme, 'node_modules'), 'dir');
  const output = path.join(theme, 'public');
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, baseURL).pathname);
    if (!pathname.startsWith('/sam/')) { response.writeHead(404).end(); return; }
    let file = path.resolve(output, pathname.slice(5));
    if (!file.startsWith(output + path.sep) && file !== output) { response.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { response.writeHead(404).end(); return; }
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseURL = `http://127.0.0.1:${server.address().port}/sam/`;
  execFileSync('sh', [path.join(theme, 'scripts/build_docs.sh')], {
    cwd: temporary, env: { ...process.env, HUGO_BASEURL: baseURL }, stdio: 'pipe'
  });
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
});

async function gallery(options = {}) {
  const page = await browser.newPage({ reducedMotion: 'reduce', ...options });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(baseURL + 'gallery/');
  return { page, errors };
}

async function activePhoto(page) {
  return page.locator('.pswp__item[aria-hidden="false"] img.pswp__img').last().getAttribute('src');
}

test('keyboard opens a named dialog, traps focus, and Escape restores focus', async () => {
  const { page, errors } = await gallery();
  try {
    const link = page.locator('[data-gallery] a').first();
    await link.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Photos from Tokyo' });
    await dialog.waitFor({ state: 'visible' });
    assert.equal(await dialog.getAttribute('aria-modal'), 'true');
    assert.equal(await page.locator('html').evaluate(e => getComputedStyle(e).overflow), 'hidden');
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(e => e.contains(document.activeElement)), true);
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await link.evaluate(e => e === document.activeElement), true);
    assert.equal(new URL(page.url()).hash, '');
    assert.equal(await page.locator('html').evaluate(e => e.classList.contains('sam-gallery-open')), false);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('photo links survive reload and opening a fresh tab', async () => {
  const { page, errors } = await gallery();
  try {
    const link = page.locator('[data-gallery] a').first();
    const filename = await link.getAttribute('data-photo-id');
    const source = new URL(await link.getAttribute('href'), baseURL).href;
    await link.click();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    const url = page.url();
    assert.equal(new URLSearchParams(new URL(url).hash.slice(1)).get('photo'), filename);
    await page.reload();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('photo'), filename);
    assert.equal(await activePhoto(page), source);
    const fresh = await browser.newPage({ reducedMotion: 'reduce' });
    try {
      await fresh.goto(url);
      await fresh.getByRole('dialog').waitFor({ state: 'visible' });
      assert.equal(await activePhoto(fresh), source);
    } finally { await fresh.close(); }
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('legacy numeric links are one-based and invalid links do not open a dialog', async () => {
  const { page, errors } = await gallery();
  try {
    const first = await page.locator('[data-gallery] a').first().getAttribute('data-photo-id');
    await page.goto(baseURL + 'gallery/#&gid=1&pid=1');
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('photo'), first);
    for (const hash of ['gid=1&pid=0', 'gid=1&pid=9999', 'gid=1&photo=missing', 'gid=2&pid=1']) {
      await page.goto(baseURL + 'gallery/#' + hash);
      await page.reload();
      assert.equal(await page.getByRole('dialog').count(), 0);
    }
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('arrow navigation updates the photo link', async () => {
  const { page, errors } = await gallery();
  try {
    const links = page.locator('[data-gallery] a');
    const second = await links.nth(1).getAttribute('data-photo-id');
    await links.first().click();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await page.keyboard.press('ArrowRight');
    assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('photo'), second);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('gallery links work with JavaScript disabled', async () => {
  const { page } = await gallery({ javaScriptEnabled: false });
  try {
    const link = page.locator('[data-gallery] a').first();
    const target = new URL(await link.getAttribute('href'), baseURL).href;
    await link.click();
    assert.equal(page.url(), target);
  } finally { await page.close(); }
});

test('all gallery and article images decode on mobile', async () => {
  const { page, errors } = await gallery({ viewport: { width: 390, height: 844 } });
  try {
    for (const route of ['gallery/', 'portfolio/', 'posts/image-post/']) {
      await page.goto(baseURL + route);
      const images = await page.locator('img').evaluateAll(elements => Promise.all(elements.map(async image => {
        image.loading = 'eager';
        try { await image.decode(); } catch (_) {}
        return { source: image.currentSrc || image.src, width: image.naturalWidth };
      })));
      assert.ok(images.length > 0);
      for (const image of images) assert.ok(image.width > 0, image.source);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('reduced motion leaves video paused with a working poster and playback control', async () => {
  const { page, errors } = await gallery();
  try {
    await page.goto(baseURL);
    const video = page.locator('video');
    assert.equal(await video.evaluate(e => e.paused), true);
    const poster = await video.getAttribute('poster');
    assert.equal((await page.request.get(new URL(poster, baseURL).href)).status(), 200);
    const source = await page.locator('video source').getAttribute('src');
    assert.equal((await page.request.get(new URL(source, baseURL).href)).status(), 200);
    await page.getByRole('button', { name: 'Play background video' }).click();
    await page.getByRole('button', { name: 'Pause background video' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Pause background video' }).click();
    assert.equal(await video.evaluate(e => e.paused), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});
