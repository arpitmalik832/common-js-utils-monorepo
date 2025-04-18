/* eslint-disable no-console */
/**
 * Script to get the size of the files in the project build dir.
 * @file This file is saved as `scripts/size.js`.
 */
import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import distDirs from './enums.js';
import { getAggregatedSizes, getSizes } from './utils.js';
import { generateFileName } from '../src/utils/fileUtils.js';

const { argv } = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output file',
    demandOption: false,
  })
  .help()
  .example('node size.js -o output.json');

const { output } = argv;

/**
 * Get the size of the files in the project build dir.
 * @returns {void}
 * @example
 * main();
 */
function main() {
  console.log('Running "size" benchmark, please wait...');

  const sizes = getSizes(distDirs);

  const aggregatedResultsString = getAggregatedSizes(sizes);

  const filepath = generateFileName(`${process.cwd()}/.logs`, 'size', 'json');
  const outputPath = output || filepath;
  fs.writeFileSync(outputPath, `${aggregatedResultsString}\n`);

  console.log('Results:', aggregatedResultsString);
  console.log('Results written to', outputPath);
}

main();
