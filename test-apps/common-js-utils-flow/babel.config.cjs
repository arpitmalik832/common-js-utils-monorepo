/**
 * Contains the babel configuration for the library.
 * @file This file is saved as `babel.config.cjs`.
 */
const config = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-env',
    [
      '@babel/preset-flow',
      {
        jsxRuntime: 'automatic',
      },
    ],
  ],
  plugins: [
    '@babel/transform-runtime',
    '@babel/plugin-syntax-import-assertions',
    'babel-plugin-syntax-hermes-parser',
  ],
};

module.exports = config;
