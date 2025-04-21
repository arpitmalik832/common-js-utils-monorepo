/**
 * @file Global variables.
 */
import globals from 'globals';

const globalsConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: true,
        BlobPart: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 2,
    },
  },
];

export default globalsConfig;
