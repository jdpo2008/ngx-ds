// Runs axe-core (WCAG 2.2 A/AA rules) on every story of the static Storybook.
//
//   npm run build-storybook && npm run test:a11y
//
// Options:
//   --dir <path>          static Storybook folder (default: storybook-static)
//   --themes light,dark   themes to check, set through the `theme` global (default: both)
//   --filter <text>       only stories whose id contains <text>
//   --verbose             print axe's explanation for each failing node
//   --warn <rules>        comma-separated axe rule ids reported as warnings only
//   --json <file>         also write every violation (all nodes) to <file>
//
// A story opts out with the `skip-a11y` tag: `tags: ['skip-a11y']`.
// Exits with code 1 when a story has violations other than warnings.

import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const { values: args } = parseArgs({
  options: {
    dir: { type: 'string', default: 'storybook-static' },
    themes: { type: 'string', default: 'light,dark' },
    filter: { type: 'string', default: '' },
    verbose: { type: 'boolean', default: false },
    warn: { type: 'string', default: '' },
    json: { type: 'string', default: '' },
  },
});

const ROOT = resolve(args.dir);
const THEMES = args.themes.split(',').filter(Boolean);
const WARN = new Set(args.warn.split(',').filter(Boolean));
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const CONCURRENCY = 4;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

function serve(root) {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(root, path);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

async function checkStory(context, base, story, theme) {
  const page = await context.newPage();
  try {
    const url = `${base}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`;
    await page.goto(url);
    await page.waitForFunction(
      () => document.querySelector('#storybook-root')?.childElementCount > 0,
      null,
      { timeout: 15_000 },
    );
    // Let entry transitions and async rendering settle.
    await page.waitForTimeout(400);
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    return violations;
  } catch (err) {
    return [
      { id: 'render-error', impact: 'critical', help: String(err.message ?? err), nodes: [] },
    ];
  } finally {
    await page.close();
  }
}

const server = await serve(ROOT);
const base = `http://127.0.0.1:${server.address().port}`;
const index = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter(
  (e) => e.type === 'story' && !e.tags?.includes('skip-a11y') && e.id.includes(args.filter),
);

const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'reduce' });
const jobs = stories.flatMap((story) => THEMES.map((theme) => ({ story, theme })));
const failures = [];
let next = 0;

async function worker() {
  while (next < jobs.length) {
    const { story, theme } = jobs[next++];
    const violations = await checkStory(context, base, story, theme);
    if (violations.length) failures.push({ story, theme, violations });
  }
}

const started = Date.now();
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();
server.close();

failures.sort((a, b) => a.story.id.localeCompare(b.story.id) || a.theme.localeCompare(b.theme));
if (args.json) {
  const report = failures.map(({ story, theme, violations }) => ({
    story: story.id,
    theme,
    violations: violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({ target: n.target, html: n.html, data: n.any?.[0]?.data })),
    })),
  }));
  await writeFile(args.json, JSON.stringify(report, null, 2));
}
for (const { story, theme, violations } of failures) {
  console.log(`\n✗ ${story.title} › ${story.name} [${theme}]  (${story.id})`);
  for (const v of violations) {
    const level = WARN.has(v.id) ? 'warn' : v.impact;
    console.log(`  - ${v.id} (${level}): ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.log(`      ${node.target.join(' ')}`);
      if (args.verbose) console.log(`        ${node.failureSummary.replace(/\s+/g, ' ')}`);
    }
    if (v.nodes.length > 3) console.log(`      … ${v.nodes.length - 3} more`);
  }
}

const blocking = failures.filter((f) => f.violations.some((v) => !WARN.has(v.id)));
const warned = failures.length - blocking.length;
const secs = ((Date.now() - started) / 1000).toFixed(1);
console.log(
  `\n${jobs.length - blocking.length}/${jobs.length} checks passed` +
    (warned ? ` (${warned} with warnings only)` : '') +
    ` — ${stories.length} stories × ${THEMES.length} themes in ${secs}s`,
);
process.exit(blocking.length ? 1 : 0);
