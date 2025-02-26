/**
 * This file is used to configure lintstaged.
 * @file This file is saved as '.lintstagedrc.js'.
 */
const config = {
  '**/*.{mjs,cjs,js,jsx,mdx,md}': ['pnpm lint-js:fix', 'pnpm prettier:fix'],
  '**/*.{css,scss}': ['pnpm lint-css:fix', 'pnpm prettier:fix'],
  '**/*.json': ['pnpm prettier:fix'],
};

export default config;
