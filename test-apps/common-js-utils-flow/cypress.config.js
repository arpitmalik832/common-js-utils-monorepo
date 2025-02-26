/**
 * This file is used to configure Cypress.
 * @file The file is saved as `cypress.config.cjs`.
 */
import { defineConfig } from 'cypress';
import fs from 'fs';

const config = defineConfig({
  e2e: {
    video: true,
    setupNodeEvents(on) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some(test =>
            test.attempts.some(attempt => attempt.state === 'failed'),
          );
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video);
          }
        }
      });
    },
  },
});

export default config;
