/**
 * Contains common paths for the library.
 * @file This file is saved as `commonPaths.mjs`.
 */
import path from 'path';

const PROJECT_ROOT = path.resolve();

const projectRootPath = PROJECT_ROOT;
const entryPath = path.join(PROJECT_ROOT, 'src', 'index.js');
const outputPath = path.join(PROJECT_ROOT, 'dist');
const iconsPath = path.join(PROJECT_ROOT, 'src', 'assets', 'icons');
const iconsListPath = path.join(
  PROJECT_ROOT,
  'static',
  'enums',
  'icons_list.mjs',
);
const stylesPath = path.join(outputPath, 'index.css');

export {
  projectRootPath,
  entryPath,
  outputPath,
  iconsPath,
  iconsListPath,
  stylesPath,
};
