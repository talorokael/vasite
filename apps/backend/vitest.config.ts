import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './test/globalSetup.ts', // run once
    setupFiles: ['./test/setup.ts'], // runs per file (for table clearing)
    include: ['test/**/*.test.ts'],
    hookTimeout: 30000,
  },
});