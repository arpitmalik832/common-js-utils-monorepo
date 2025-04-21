/* eslint-disable no-console */
/**
 * This script updates the typography SCSS file to use the correct import path.
 * @file This script is saved as `updateImportForMixins.js`.
 */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { getPaths } from '../src/utils/fileUtils.js';
import { updateTypographyUse } from './utils.js';

const { argv } = yargs(hideBin(process.argv))
  .option('projectRoot', {
    alias: 'r',
    type: 'string',
    description: 'Project root',
    demandOption: false,
  })
  .help()
  .example('node generate_icons_list.js -r /path/to/project');

/**
 * Main function to update the typography SCSS file to use the correct import path.
 * @example
 * main();
 */
function main() {
  const { projectRoot } = argv;

  if (!projectRoot) {
    console.error('\x1b[41m%s\x1b[0m', 'Project root is required');
    process.exit(1);
  }
  const { typographyMixinPath } = getPaths(projectRoot);

  updateTypographyUse(typographyMixinPath);
}

main();
