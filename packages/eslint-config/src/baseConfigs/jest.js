/**
 * @file ESLint configuration for Jest.
 */
import jestPlugin from 'eslint-plugin-jest';

import { FILES_ENUMS } from '../enums/index.js';

const jestConfig = [
  {
    files: [FILES_ENUMS.JEST_FILES],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
  },
];

export default jestConfig;
