import { defineConfig } from 'vitest/config';

// Loaded by `ng test` (angular.json → test.options.runnerConfig); the Angular builder merges
// its own settings on top. Under full-suite load some keyboard / forms specs need more than
// Vitest's default 5 s, even though each one takes well under a second when run alone.
export default defineConfig({
  test: {
    testTimeout: 15_000,
  },
});
