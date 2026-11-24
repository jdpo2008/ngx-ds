// Visual regression: screenshots every story of the static Storybook in the light and
// dark themes and compares them with the baselines in visual-baselines/.
//
//   npm run build-storybook && npm run test:visual
//
// Font rendering differs between operating systems, so baselines are made in the
// Playwright Docker image (the same one CI uses): `npm run test:visual:docker -- --update`,
// or the "Update visual baselines" workflow on GitHub.
//
// Options:
//   --dir <path>            static Storybook folder (default: storybook-static)
//   --baselines <path>      baseline folder (default: visual-baselines)
//   --out <path>            where failing screenshots and diffs go (default: visual-report)
//   --themes light,dark     themes to check (default: both)
//   --filter <text>         only stories whose id contains <text>
//   --update                write the screenshots as the new baselines
//   --max-diff-ratio <n>    share of pixels allowed to differ (default: 0.0001)
//   --threshold <n>         how different a pixel's colour must be to count, 0–1 (default: 0)
//
// A story opts out with the `skip-visual` tag: `tags: ['skip-visual']`.
// Exits with code 1 when a screenshot differs from its baseline or has none.

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { gotoStory, listStories, runPool, serveStorybook } from './lib/storybook.mjs';

const { values: args } = parseArgs({
  options: {
    dir: { type: 'string', default: 'storybook-static' },
    baselines: { type: 'string', default: 'visual-baselines' },
    out: { type: 'string', default: 'visual-report' },
    themes: { type: 'string', default: 'light,dark' },
    filter: { type: 'string', default: '' },
    update: { type: 'boolean', default: false },
    'max-diff-ratio': { type: 'string', default: '0.0001' },
    threshold: { type: 'string', default: '0' },
  },
});

const THEMES = args.themes.split(',').filter(Boolean);
const BASELINES = resolve(args.baselines);
const OUT = resolve(args.out);
const MAX_DIFF_RATIO = Number(args['max-diff-ratio']);
const THRESHOLD = Number(args.threshold);
const CONCURRENCY = 4;
const CONTEXT_OPTIONS = {
  viewport: { width: 1024, height: 768 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  locale: 'es-ES',
  timezoneId: 'Europe/Madrid',
};
// Stories that show "today" or relative times render the same date on every run.
const FIXED_NOW = new Date('2026-01-15T10:00:00+01:00');

// Remote images (avatars, carousel photos) are replaced by a flat placeholder,
// so the screenshots do not depend on the network.
function placeholderPng() {
  const png = new PNG({ width: 8, height: 8 });
  for (let i = 0; i < png.data.length; i += 4) png.data.set([203, 213, 225, 255], i);
  return PNG.sync.write(png);
}
const PLACEHOLDER = placeholderPng();

// Seeded Math.random, so demos with random data render the same way every run.
function seedRandom() {
  let seed = 0x2f6b9a1d;
  Math.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Waits until the DOM has not changed for `quietMs` (at most `maxMs`), so stories that
// load data with a timer (e.g. the server-side Table) are captured after it resolves.
function waitForDomQuiet(page, quietMs = 300, maxMs = 3000) {
  return page.evaluate(
    ([quiet, max]) =>
      new Promise((done) => {
        let timer;
        const finish = () => {
          observer.disconnect();
          clearTimeout(timer);
          done();
        };
        const observer = new MutationObserver(() => {
          clearTimeout(timer);
          timer = setTimeout(finish, quiet);
        });
        observer.observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        });
        timer = setTimeout(finish, quiet);
        setTimeout(finish, max);
      }),
    [quietMs, maxMs],
  );
}

async function screenshot(page) {
  return page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
}

/** Number of differing pixels, or Infinity when the sizes differ. */
function compare(expected, actual) {
  if (expected.width !== actual.width || expected.height !== actual.height) {
    return { diffPixels: Infinity, diff: null };
  }
  const diff = new PNG({ width: expected.width, height: expected.height });
  const diffPixels = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: THRESHOLD },
  );
  return { diffPixels, diff };
}

async function readBaseline(file) {
  try {
    return PNG.sync.read(await readFile(file));
  } catch {
    return null;
  }
}

async function checkStory(browser, base, story, theme) {
  const name = `${story.id}.${theme}.png`;
  const baselineFile = join(BASELINES, name);
  // One context per screenshot: the fake clock applies to the whole context.
  const context = await browser.newContext(CONTEXT_OPTIONS);
  const page = await context.newPage();
  try {
    await page.clock.setFixedTime(FIXED_NOW);
    await page.addInitScript(seedRandom);
    await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) =>
      route.request().resourceType() === 'image'
        ? route.fulfill({ contentType: 'image/png', body: PLACEHOLDER })
        : route.abort(),
    );
    await gotoStory(page, base, story, theme);
    await waitForDomQuiet(page);
    await page.evaluate(() => document.fonts.ready);

    let shot = await screenshot(page);
    if (args.update) {
      await writeFile(baselineFile, shot);
      return { name, status: 'updated' };
    }

    const expected = await readBaseline(baselineFile);
    if (!expected) {
      await writeFile(join(OUT, name.replace(/\.png$/, '.actual.png')), shot);
      return { name, status: 'missing' };
    }

    let result = compare(expected, PNG.sync.read(shot));
    const allowed = Math.floor(expected.width * expected.height * MAX_DIFF_RATIO);
    if (result.diffPixels > allowed) {
      // One retry, for late async rendering.
      await page.waitForTimeout(500);
      shot = await screenshot(page);
      result = compare(expected, PNG.sync.read(shot));
    }
    if (result.diffPixels <= allowed) return { name, status: 'ok' };

    const stem = join(OUT, name.replace(/\.png$/, ''));
    await writeFile(`${stem}.actual.png`, shot);
    await writeFile(`${stem}.expected.png`, PNG.sync.write(expected));
    if (result.diff) await writeFile(`${stem}.diff.png`, PNG.sync.write(result.diff));
    const detail =
      result.diffPixels === Infinity ? 'size changed' : `${result.diffPixels} pixels differ`;
    return { name, status: 'changed', detail };
  } catch (err) {
    return { name, status: 'error', detail: String(err.message ?? err).split('\n')[0] };
  } finally {
    await context.close();
  }
}

const { server, base } = await serveStorybook(args.dir);
const stories = await listStories(args.dir, { skipTag: 'skip-visual', filter: args.filter });
await mkdir(BASELINES, { recursive: true });
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const jobs = stories.flatMap((story) => THEMES.map((theme) => ({ story, theme })));
const results = [];

const started = Date.now();
await runPool(jobs, CONCURRENCY, async ({ story, theme }) => {
  results.push(await checkStory(browser, base, story, theme));
});
await browser.close();
server.close();

// After a full update, drop baselines of stories that no longer exist.
if (args.update && !args.filter && args.themes === 'light,dark') {
  const current = new Set(results.map((r) => r.name));
  for (const file of await readdir(BASELINES)) {
    if (file.endsWith('.png') && !current.has(file)) await rm(join(BASELINES, file));
  }
}

const failed = results
  .filter((r) => !['ok', 'updated'].includes(r.status))
  .sort((a, b) => a.name.localeCompare(b.name));
for (const r of failed) console.log(`✗ ${r.name}  ${r.status}${r.detail ? ` (${r.detail})` : ''}`);

const secs = ((Date.now() - started) / 1000).toFixed(1);
const summary = args.update
  ? `${results.length - failed.length} baselines written`
  : `${jobs.length - failed.length}/${jobs.length} screenshots match`;
console.log(`\n${summary} — ${stories.length} stories × ${THEMES.length} themes in ${secs}s`);
if (failed.length && !args.update) {
  console.log(`Screenshots and diffs: ${args.out}/`);
  if (failed.some((r) => r.status === 'missing')) {
    console.log('New stories need baselines: npm run test:visual:docker -- --update');
  }
}
process.exit(failed.length ? 1 : 0);
