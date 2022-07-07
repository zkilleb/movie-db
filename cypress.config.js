import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'test/tests/specs/*',
    watchForFileChanges: false,
    setupNodeEvents(on, config) {},
  },
});
