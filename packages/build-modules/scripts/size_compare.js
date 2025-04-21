/* eslint-disable no-console */
/**
 * Script to compare the size of two benchmark results.
 * @file This file is saved as `size_compare.js`.
 */
import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { generateMarkdownTable, mergeData, readJsonFile } from './utils.js';
import { generateFileName } from '../src/utils/fileUtils.js';

const { argv } = yargs(hideBin(process.argv))
  .option('base', {
    alias: 'b',
    type: 'string',
    description: 'Base benchmark results file',
    demandOption: false,
  })
  .option('patch', {
    alias: 'p',
    type: 'string',
    description: 'Patch benchmark results file',
    demandOption: false,
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output markdown file',
    demandOption: false,
  })
  .help()
  .example('node size_compare.js -b base.json -p patch.json -o output.md');

/**
 * Compare the size of two benchmark results.
 * @returns {void}
 * @example
 * main();
 */
function main() {
  const baseFile = argv.base || null;
  const patchFile = argv.patch || null;

  if (!baseFile || !patchFile) {
    console.error('Error: Both base and patch files are required');
    console.log(
      'Usage: node size_compare.js -b base.json -p patch.json [-o output.md]',
    );
    process.exit(1);
  }

  const baseResults = readJsonFile(baseFile);
  const patchResults = readJsonFile(patchFile);
  const markdownTable = generateMarkdownTable(
    mergeData(baseResults, patchResults),
  );

  const outputPath =
    argv.output ||
    generateFileName(`${process.cwd()}/.logs`, 'size-comparison', 'md');
  fs.writeFileSync(outputPath, markdownTable);

  console.log('Results:', markdownTable);
  console.log('Results written to', outputPath);
}

main();
