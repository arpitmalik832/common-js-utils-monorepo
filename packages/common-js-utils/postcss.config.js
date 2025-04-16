/**
 * @file This file is saved as `postcss.config.js`.
 */

/**
 * Get the postcss config.
 * @param {object} ctx - The context object.
 * @returns {object} The postcss config.
 * @example
 * const config = getConfig();
 */
function getConfig(ctx) {
  return {
    plugins: {
      'postcss-preset-env': {},
      autoprefixer: {},
      'postcss-flexbugs-fixes': {},
      cssnano: ctx.env === 'production' || ctx.env === 'beta' ? {} : false,
    },
  };
}

export default getConfig;
