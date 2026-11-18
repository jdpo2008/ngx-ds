// Runs storybook-visual.mjs inside the Playwright Docker image that matches the installed
// Playwright version, so screenshots render like they do in CI. Arguments are passed through:
//
//   npm run test:visual:docker -- --update --filter button

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const { version } = createRequire(import.meta.url)('playwright/package.json');
const image = `mcr.microsoft.com/playwright:v${version}-noble`;

const { status, error } = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    '--ipc=host',
    '-v',
    `${process.cwd()}:/work`,
    '-w',
    '/work',
    image,
    'node',
    'scripts/storybook-visual.mjs',
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' },
);
if (error) console.error(`Could not run docker: ${error.message}`);
process.exit(status ?? 1);
