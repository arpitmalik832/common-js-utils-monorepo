/**
 * Copy Plugin for Rollup.
 * @file The file is saved as `copy.mjs`.
 */
import copyPlugin from 'rollup-plugin-copy';

/**
 * Generates the configuration for the rollup copy plugin.
 * @param {Array} arr - The array of targets to copy in the format of `{ src: string, dest: string }`.
 * @returns {import('rollup-plugin-copy').Options} The configuration object for the copy plugin.
 * @example
 * const copyConfig = config();
 * console.log(copyConfig);
 */
function CopyPlugin(arr) {
  return copyPlugin({
    targets: arr,
  });
}

export default CopyPlugin;
