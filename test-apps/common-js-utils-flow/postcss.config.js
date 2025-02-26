/**
 * Configuration for PostCSS.
 * @file This file is saved as `postcss.config.cjs`.
 */
import presetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

const config = {
  plugins: [presetEnv, autoprefixer],
};

export default config;
