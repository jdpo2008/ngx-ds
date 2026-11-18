// Bundle size of the built library (dist/ngx-ds), optionally compared with another build.
//
//   npm run build && npm run size
//   npm run size -- --base ../base/dist/ngx-ds --max-growth 5 --markdown size.md
//
// Options:
//   --dir <path>          build to measure (default: dist/ngx-ds)
//   --base <path>         build to compare with (e.g. the target branch of a PR)
//   --max-growth <pct>    fail when the gzipped JavaScript grows more than this (default: 5)
//   --markdown <file>     also write the report as Markdown (for a PR comment)
//
// Exits with code 1 when --base is given and the gzipped JavaScript grows past --max-growth.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { parseArgs } from 'node:util';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const { values: args } = parseArgs({
  options: {
    dir: { type: 'string', default: 'dist/ngx-ds' },
    base: { type: 'string' },
    'max-growth': { type: 'string', default: '5' },
    markdown: { type: 'string' },
  },
});
const MAX_GROWTH = Number(args['max-growth']);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => join(e.parentPath ?? e.path, e.name))
    .filter((f) => !f.endsWith('.map'));
}

/** Sizes in bytes, grouped as they matter to a consumer. */
async function measure(dir) {
  const root = resolve(dir);
  try {
    await stat(join(root, 'package.json'));
  } catch {
    throw new Error(`No build in ${dir}: run npm run build first.`);
  }
  const sizes = { js: 0, jsGzip: 0, jsBrotli: 0, styles: 0, types: 0, total: 0 };
  for (const file of await listFiles(root)) {
    const rel = relative(root, file).split(sep).join('/');
    const content = await readFile(file);
    sizes.total += content.length;
    if (rel.startsWith('fesm2022/') && rel.endsWith('.mjs')) {
      sizes.js += content.length;
      sizes.jsGzip += gzipSync(content, { level: 9 }).length;
      sizes.jsBrotli += brotliCompressSync(content).length;
    } else if (rel.startsWith('styles/')) {
      sizes.styles += content.length;
    } else if (rel.endsWith('.d.ts')) {
      sizes.types += content.length;
    }
  }
  return sizes;
}

const ROWS = [
  ['jsGzip', 'JavaScript (gzip)'],
  ['jsBrotli', 'JavaScript (brotli)'],
  ['js', 'JavaScript (raw)'],
  ['styles', 'Styles (SCSS)'],
  ['types', 'Type declarations'],
  ['total', 'Package total (no source maps)'],
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
const pct = (current, base) => (base ? ((current - base) / base) * 100 : 0);

function formatDiff(current, base) {
  const diff = current - base;
  if (diff === 0) return '—';
  const sign = diff > 0 ? '+' : '−';
  return `${sign}${kb(Math.abs(diff))} (${sign}${Math.abs(pct(current, base)).toFixed(2)} %)`;
}

const current = await measure(args.dir);
const base = args.base ? await measure(args.base) : null;

const lines = [];
if (base) {
  const growth = pct(current.jsGzip, base.jsGzip);
  const failed = growth > MAX_GROWTH;
  lines.push('<!-- bundle-size -->', '## Bundle size', '');
  lines.push('| | Base | This PR | Diff |', '|---|---:|---:|---:|');
  for (const [key, label] of ROWS) {
    lines.push(
      `| ${label} | ${kb(base[key])} | ${kb(current[key])} | ${formatDiff(current[key], base[key])} |`,
    );
  }
  lines.push('');
  lines.push(
    failed
      ? `❌ The gzipped JavaScript grows ${growth.toFixed(2)} %, more than the ${MAX_GROWTH} % limit.`
      : `✅ The gzipped JavaScript is within the ${MAX_GROWTH} % growth limit.`,
  );
  console.log(lines.slice(1).join('\n'));
  if (args.markdown) await writeFile(args.markdown, lines.join('\n') + '\n');
  process.exit(failed ? 1 : 0);
} else {
  for (const [key, label] of ROWS)
    console.log(`${label.padEnd(32)} ${kb(current[key]).padStart(10)}`);
  if (args.markdown) {
    const md = [
      '| | Size |',
      '|---|---:|',
      ...ROWS.map(([k, l]) => `| ${l} | ${kb(current[k])} |`),
    ];
    await writeFile(args.markdown, md.join('\n') + '\n');
  }
}
