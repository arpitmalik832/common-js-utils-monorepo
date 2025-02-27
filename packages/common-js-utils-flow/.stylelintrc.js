/**
 * Stylelint configuration.
 * For more info, pls refer to https://stylelint.io/user-guide/configuration/.
 * @file This file is saved as `.stylelintrc.js`.
 */
// stylelint configuration
const config = {
  // The standard config based on a handful of CSS style guides
  // https://github.com/stylelint/stylelint-config-standard
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-idiomatic-order',
    'stylelint-config-hudochenkov/order',
    'stylelint-config-clean-order/error',
  ],
  // stylelint plugin to sort CSS rules content with specified order
  // https://github.com/hudochenkov/stylelint-order
  plugins: ['stylelint-order'],
  rules: {
    'declaration-property-unit-allowed-list': {
      '/^border|^padding|^gap/': ['rem'],
    },
    'unit-allowed-list': ['%', 'rem', 'em', 'ms', 'deg', 'vw', 'vh', 'fr'],
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'hwb', 'lch', 'hsl'],
    'custom-property-pattern': [
      '^(--)*[a-z0-9]+(-[a-z0-9]+)*$',
      {
        message: x => `Expected ${x} to be in kebab-case`,
      },
    ],
    'scss/at-mixin-pattern': [
      '^[a-z]+([A-Z][a-z0-9]+)*$',
      {
        message: x => `Expected ${x} to be camelCase`,
      },
    ],
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        message: x => `Expected ${x} to be in smallCamelCase`,
      },
    ],
    'selector-id-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      {
        message: x => `Expected ${x} to be in smallCamelCase`,
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['if', 'else', 'mixin', 'include', 'each', 'use'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['if', 'else', 'each'],
      },
    ],
  },
  ignoreFiles: [
    '**/*.{mjs,cjs,js,jsx,ts,mdx}',
    'build/**/*.{css,scss}',
    'dist/**/*.{css,scss}',
    'static/**/*.{css,scss}',
    'node_modules/**/*.{css,scss}',
    'coverage/**/*.{css,scss}',
    'storybook-static/**/*.{css,scss}',
  ],
};

export default config;
