/**
 * Copy Plugin for Rollup.
 * @file The file is saved as `copy.mjs`.
 */
import copy from 'rollup-plugin-copy';

/**
 * Generates the configuration for the rollup copy plugin.
 * @returns {import('rollup-plugin-copy').Options} The configuration object for the copy plugin.
 * @example
 * const copyConfig = config();
 * console.log(copyConfig);
 */
function config() {
  return copy({
    targets: [
      {
        src: 'static/styles/*',
        dest: 'dist/styles',
      },
      {
        src: 'src/styles/mixins/*',
        dest: 'dist/styles/mixins',
      },
      {
        src: 'static/enums/icons_list.mjs',
        dest: 'dist',
      },
      {
        src: 'src/assets/images/*',
        dest: 'dist/cjs/assets/images',
      },
      {
        src: 'src/assets/images/*',
        dest: 'dist/esm/assets/images',
      },
    ],
  });
}

export default config;
