/**
 * @file ESLint configuration for Jest.
 */
import cypressPlugin from 'eslint-plugin-cypress/flat';

import { FILES_ENUMS } from '../enums/index.js';

const cypressConfig = [
  {
    files: [FILES_ENUMS.E2E_FILES],
    ...cypressPlugin.configs.recommended,
  },
];

export default cypressConfig;
