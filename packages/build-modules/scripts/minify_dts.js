/* eslint-disable no-console */
/**
 * Minifies declaration files by removing comments and unnecessary whitespace.
 * @file The file is saved as `minify_dts.js`.
 */
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { getPaths } from '../src/utils/fileUtils.js';
import { minifyDtsDirectory } from './utils.js';

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
 * Main function to minify all TypeScript declaration files.
 * @example
 * main();
 */
function main() {
  const { projectRoot } = argv;

  if (!projectRoot) {
    console.error('\x1b[41m%s\x1b[0m', 'Project root is required');
    process.exit(1);
  }

  const paths = getPaths(projectRoot);

  try {
    minifyDtsDirectory(paths.typesPath);
    console.log(
      '\x1b[42m%s\x1b[0m',
      'Declaration files minified successfully.',
    );
  } catch (error) {
    console.error(
      '\x1b[41m%s\x1b[0m',
      'Error minifying declaration files:',
      error,
    );
  }
}

main();
