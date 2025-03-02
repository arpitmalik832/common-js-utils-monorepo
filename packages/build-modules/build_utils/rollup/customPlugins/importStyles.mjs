/**
 * Add styles import statement to the main index file.
 * @file This file is saved as `importStyles.js`.
 */
import { ENVS } from '../../config/index.mjs';

/**
 * A Rollup plugin to import styles.
 * @returns {object} The Rollup plugin object.
 * @example
 * // Example usage:
 * importStyles();
 */
export default function importStyles() {
  return {
    name: 'import-styles-plugin',
    generateBundle(options, bundle) {
      const importPath = '../index.css';
      Object.entries(bundle).forEach(([fileName, fileMeta]) => {
        let newCode = fileMeta.code;
        if (fileName === 'esm/lib.js') {
          newCode = `import "${importPath}";${![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV) ? '\n' : ''}${fileMeta.code}`;
        } else if (fileName === 'cjs/lib.js') {
          newCode = `require("${importPath}");${![ENVS.PROD, ENVS.BETA].includes(process.env.LIB_ENV) ? '\n' : ''}${fileMeta.code}`;
        }

        Object.defineProperty(bundle[fileName], 'code', { value: newCode });
      });
    },
  };
}
