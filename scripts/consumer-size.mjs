// What a consumer app pays for each component after tree-shaking.
//
// Builds a minimal Angular app (production, optimized) once with no ngx-ds import, then once per
// component, and reports how much each component adds to the app's JavaScript. This catches a
// component that starts pulling in half of the library, which `npm run size` (whole package)
// cannot see.
//
//   npm run build && npm run size:consumer
//   npm run size:consumer -- --base ../base/dist/ngx-ds --max-growth 10 --markdown consumer.md
//
// Options:
//   --dir <path>          build to measure (default: dist/ngx-ds)
//   --base <path>         build to compare with (e.g. the target branch of a PR)
//   --max-growth <pct>    fail when what a component adds (gzip) grows more than this (default: 10)
//   --min-growth <bytes>  ignore growths smaller than this, whatever the percentage (default: 512)
//   --markdown <file>     also write the report as Markdown (for a PR comment)
//
// Exits with code 1 when --base is given and a component grows past both limits.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';

const { values: args } = parseArgs({
  options: {
    dir: { type: 'string', default: 'dist/ngx-ds' },
    base: { type: 'string' },
    'max-growth': { type: 'string', default: '10' },
    'min-growth': { type: 'string', default: '512' },
    markdown: { type: 'string' },
  },
});
const MAX_GROWTH = Number(args['max-growth']);
const MIN_GROWTH = Number(args['min-growth']);

/** One app per entry. `template` must render the component with its required inputs. */
const CASES = [
  { name: 'Button', symbol: 'ButtonComponent', template: '<ngx-ds-button>Save</ngx-ds-button>' },
  { name: 'Input', symbol: 'InputComponent', template: '<ngx-ds-input label="Name" />' },
  { name: 'Select', symbol: 'SelectComponent', template: '<ngx-ds-select [options]="[]" />' },
  { name: 'Datepicker', symbol: 'DatepickerComponent', template: '<ngx-ds-datepicker />' },
  { name: 'Modal', symbol: 'ModalComponent', template: '<ngx-ds-modal />' },
  {
    name: 'Table',
    symbol: 'TableComponent',
    template: '<ngx-ds-table [data]="[]" [columns]="[]" />',
  },
];

const ROOT = resolve('.');
const WORK = join(ROOT, 'tmp', 'consumer-size');
const NG = join(ROOT, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const PKG = join(WORK, 'node_modules', '@jdpo2008', 'ngx-ds');

const ANGULAR_JSON = {
  version: 1,
  projects: {
    app: {
      projectType: 'application',
      root: '',
      sourceRoot: 'src',
      architect: {
        build: {
          builder: '@angular/build:application',
          options: {
            browser: 'src/main.ts',
            index: 'src/index.html',
            tsConfig: 'tsconfig.json',
            outputPath: 'out',
            optimization: true,
            outputHashing: 'none',
            sourceMap: false,
            budgets: [],
          },
        },
      },
    },
  },
};

const TSCONFIG = {
  compilerOptions: {
    strict: true,
    target: 'ES2022',
    module: 'preserve',
    moduleResolution: 'bundler',
    skipLibCheck: true,
    isolatedModules: true,
  },
  files: ['src/main.ts'],
};

/** The baseline app uses signals too, so their runtime is not counted against the components. */
function mainTs(c) {
  const imp = c ? `import { ${c.symbol} } from '@jdpo2008/ngx-ds';` : '';
  const template = c ? c.template : '{{ label() }}';
  return `import { Component, computed, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
${imp}

@Component({
  selector: 'app-root',
  imports: [${c ? c.symbol : ''}],
  template: \`${template}\`,
})
class App {
  readonly count = signal(0);
  readonly label = computed(() => 'n' + this.count());
}

bootstrapApplication(App);
`;
}

async function setup() {
  await rm(WORK, { recursive: true, force: true });
  await mkdir(join(WORK, 'src'), { recursive: true });
  await writeFile(join(WORK, 'angular.json'), JSON.stringify(ANGULAR_JSON, null, 2));
  await writeFile(join(WORK, 'tsconfig.json'), JSON.stringify(TSCONFIG, null, 2));
  await writeFile(
    join(WORK, 'src', 'index.html'),
    '<!doctype html><html><body><app-root></app-root></body></html>\n',
  );
}

/** Gzipped size of every JavaScript file the app build emits. */
async function buildApp(c) {
  await writeFile(join(WORK, 'src', 'main.ts'), mainTs(c));
  await rm(join(WORK, 'out'), { recursive: true, force: true });
  try {
    execFileSync(process.execPath, [NG, 'build'], {
      cwd: WORK,
      stdio: 'pipe',
      env: { ...process.env, NG_CLI_ANALYTICS: 'false', NG_FORCE_TTY: 'false' },
    });
  } catch (err) {
    process.stderr.write(err.stdout?.toString() ?? '');
    process.stderr.write(err.stderr?.toString() ?? '');
    throw new Error(`App build failed for ${c ? c.name : 'the baseline'}.`);
  }
  const dir = join(WORK, 'out', 'browser');
  let gzip = 0;
  for (const file of await readdir(dir)) {
    if (file.endsWith('.js'))
      gzip += gzipSync(await readFile(join(dir, file)), { level: 9 }).length;
  }
  return gzip;
}

/**
 * Peer dependencies the build needs but this checkout no longer installs (e.g. a base branch that
 * still uses a package the PR replaced) are copied from the build's own checkout
 * (`<checkout>/dist/ngx-ds` → `<checkout>/node_modules`).
 */
async function copyPeers(lib) {
  const { peerDependencies = {} } = JSON.parse(await readFile(join(lib, 'package.json'), 'utf8'));
  for (const name of Object.keys(peerDependencies)) {
    const target = join(WORK, 'node_modules', name);
    await rm(target, { recursive: true, force: true });
    if (existsSync(join(ROOT, 'node_modules', name))) continue;
    const source = resolve(lib, '..', '..', 'node_modules', name);
    if (existsSync(source)) await cp(source, target, { recursive: true, dereference: true });
  }
}

/** Bytes (gzip) each component adds to the baseline app, using the library build in `dir`. */
async function measure(dir) {
  const lib = resolve(dir);
  await rm(PKG, { recursive: true, force: true });
  await cp(lib, PKG, { recursive: true });
  const baseline = await buildApp(null);
  const added = {};
  for (const c of CASES) {
    added[c.name] = (await buildApp(c)) - baseline;
    console.error(`  ${c.name}: +${kb(added[c.name])}`);
  }
  return added;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
const pct = (current, base) => (base ? ((current - base) / base) * 100 : 0);

function formatDiff(current, base) {
  const diff = current - base;
  if (diff === 0) return '—';
  const sign = diff > 0 ? '+' : '−';
  return `${sign}${kb(Math.abs(diff))} (${sign}${Math.abs(pct(current, base)).toFixed(1)} %)`;
}

await setup();
try {
  console.error(`Measuring ${args.dir}`);
  const current = await measure(args.dir);
  const base = args.base
    ? (console.error(`Measuring ${args.base}`), await measure(args.base))
    : null;

  const lines = ['<!-- consumer-size -->', '## Consumer bundle size', ''];
  lines.push(
    'What each component adds (gzip) to a minimal production Angular app, after tree-shaking.',
    '',
  );
  let failed = [];
  if (base) {
    lines.push('| Component | Base | This PR | Diff |', '|---|---:|---:|---:|');
    for (const { name } of CASES) {
      const diff = current[name] - base[name];
      if (diff > MIN_GROWTH && pct(current[name], base[name]) > MAX_GROWTH) failed.push(name);
      lines.push(
        `| ${name} | ${kb(base[name])} | ${kb(current[name])} | ${formatDiff(current[name], base[name])} |`,
      );
    }
    lines.push('');
    lines.push(
      failed.length
        ? `❌ ${failed.join(', ')} grow more than ${MAX_GROWTH} % (and more than ${MIN_GROWTH} bytes).`
        : `✅ Every component is within the ${MAX_GROWTH} % growth limit.`,
    );
  } else {
    lines.push('| Component | Adds |', '|---|---:|');
    for (const { name } of CASES) lines.push(`| ${name} | ${kb(current[name])} |`);
  }
  console.log(lines.slice(1).join('\n'));
  if (args.markdown) await writeFile(args.markdown, lines.join('\n') + '\n');
  process.exitCode = failed.length ? 1 : 0;
} finally {
  await rm(WORK, { recursive: true, force: true });
}
