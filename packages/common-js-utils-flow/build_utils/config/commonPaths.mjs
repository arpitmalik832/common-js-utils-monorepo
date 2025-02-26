/**
 * Contains common paths for the library.
 * @file This file is saved as `commonPaths.mjs`.
 */
import { resolve, join } from 'path';

const PROJECT_ROOT = resolve();

const projectRootPath = PROJECT_ROOT;
const entryPath = join(PROJECT_ROOT, 'src', 'index.js');
const outputPath = join(PROJECT_ROOT, 'dist');
const iconsPath = join(PROJECT_ROOT, 'src', 'assets', 'icons');
const iconsListPath = join(PROJECT_ROOT, 'static', 'enums', 'icons_list.mjs');
const stylesPath = join(outputPath, 'index.css');

export {
  projectRootPath,
  entryPath,
  outputPath,
  iconsPath,
  iconsListPath,
  stylesPath,
};
