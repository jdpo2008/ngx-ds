// PostToolUse hook (Edit|Write): formats the edited file with Prettier.
// Only touches .ts/.html/.scss/.mdx files under projects/. Never blocks Claude.
import { execFileSync } from 'node:child_process';
import { relative, resolve } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

try {
  const input = JSON.parse(raw);
  const filePath = input?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rel = relative(root, resolve(filePath)).replaceAll('\\', '/');

  if (!rel.startsWith('projects/') || !/\.(ts|html|scss|mdx)$/.test(rel)) process.exit(0);

  const prettier = resolve(root, 'node_modules/prettier/bin/prettier.cjs');
  execFileSync(process.execPath, [prettier, '--write', '--log-level', 'warn', rel], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
} catch {
  // Formatting is best-effort; a failure must not interrupt the session.
}
process.exit(0);
