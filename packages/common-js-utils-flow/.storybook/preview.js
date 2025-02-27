/**
 * Storybook preview configuration.
 * @file This file is saved as `.storybook/preview.js`.
 */
import '../static/styles/postcss-processed/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  Story => (
    <div style={{ margin: '3em' }}>
      <Story />
    </div>
  ),
];
