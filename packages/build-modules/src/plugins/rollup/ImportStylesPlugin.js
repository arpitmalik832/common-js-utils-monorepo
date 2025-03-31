/**
 * Add styles import statement to the main index file.
 * @file This file is saved as `importStyles.js`.
 */
import { MAIN_ENUMS } from '../../enums/index.js';

/**
 * A Rollup plugin to import styles.
 * @param {string} env - The environment variable to check.
 * @returns {object} The Rollup plugin object.
 * @example
 * // Example usage:
 * importStyles();
 */
function ImportStylesPlugin(env) {
  return {
    name: 'import-styles-plugin',
    generateBundle(options, bundle) {
      const importPath = '../index.css';
      Object.entries(bundle).forEach(([fileName, fileMeta]) => {
        let newCode = fileMeta.code;
        if (fileName === 'esm/lib.js') {
          newCode = `import "${importPath}";${[MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env) ? '' : '\n'}${fileMeta.code}`;
        } else if (fileName === 'cjs/lib.js') {
          newCode = `require("${importPath}");${[MAIN_ENUMS.ENVS.PROD, MAIN_ENUMS.ENVS.BETA].includes(env) ? '' : '\n'}${fileMeta.code}`;
        }

        Object.defineProperty(bundle[fileName], 'code', { value: newCode });
      });
    },
  };
}

export default ImportStylesPlugin;
