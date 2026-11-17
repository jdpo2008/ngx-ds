// Stop hook: warns when a component folder under atoms/molecules/organisms
// is not exported from public-api.ts. Pure filesystem check (milliseconds).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;
try {
  // Already continuing because of this hook: don't block again (avoids loops).
  if (JSON.parse(raw)?.stop_hook_active) process.exit(0);
} catch {}

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const src = join(root, 'projects/ngx-ds/src');
const apiPath = join(src, 'public-api.ts');
if (!existsSync(apiPath)) process.exit(0);

const api = readFileSync(apiPath, 'utf8');
const missing = [];

for (const tier of ['atoms', 'molecules', 'organisms']) {
  const dir = join(src, 'lib', tier);
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const exportPath = `./lib/${tier}/${entry.name}`;
    if (!api.includes(`'${exportPath}'`) && !api.includes(`"${exportPath}"`)) {
      missing.push(`${tier}/${entry.name}`);
    }
  }
}

if (missing.length) {
  // exit 2 + stderr: Claude sees the message and continues to fix it.
  process.stderr.write(
    `public-api.ts is missing exports for: ${missing.join(', ')}. ` +
      `Add "export * from './lib/<tier>/<name>';" in the matching tier section.\n`,
  );
  process.exit(2);
}
process.exit(0);
