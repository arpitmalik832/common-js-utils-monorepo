/**
 * Storybook preview configuration.
 * @file This file is saved as `.storybook/preview.js`.
 */
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
  // eslint-disable-next-line no-unused-vars
  Story => (
    <div style={{ margin: '3em' }}>
      <Story />
    </div>
  ),
];
