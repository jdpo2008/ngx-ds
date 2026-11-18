// Helpers shared by the scripts that drive the static Storybook
// (storybook-a11y.mjs, storybook-visual.mjs).

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

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

/** Serves `dir` on a random local port. Resolves to `{ server, base }`. */
export async function serveStorybook(dir) {
  const root = resolve(dir);
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
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

/** Stories of the static Storybook, minus those tagged `skipTag`, filtered by id substring. */
export async function listStories(dir, { skipTag, filter = '' }) {
  const index = JSON.parse(await readFile(join(resolve(dir), 'index.json'), 'utf8'));
  return Object.values(index.entries).filter(
    (e) => e.type === 'story' && !e.tags?.includes(skipTag) && e.id.includes(filter),
  );
}

/** Opens a story in `page` with the given theme and waits until it has rendered. */
export async function gotoStory(page, base, story, theme) {
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForFunction(
    () => document.querySelector('#storybook-root')?.childElementCount > 0,
    null,
    { timeout: 15_000 },
  );
  // Let entry transitions and async rendering settle.
  await page.waitForTimeout(400);
}

/** Runs `fn` over `items` with `concurrency` workers. */
export async function runPool(items, concurrency, fn) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await fn(items[next++]);
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
}
