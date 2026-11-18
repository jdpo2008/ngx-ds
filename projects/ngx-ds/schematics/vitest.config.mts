import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Runs only the schematic specs. The schematic source is .cts (the published package is
// "type": "module", so it must compile to .cjs), and Vite only transpiles .ts/.mts by default.
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  cacheDir: '../../../node_modules/.vite',
  esbuild: { include: /\.[cm]?ts$/ },
});
