/**
 * List of projects in the monorepo.
 * @file This file is saved as `scripts/projects.js`.
 */
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const projectsPaths = [
  path.join(dirname, '../../common-js-utils/dist/cjs'),
  path.join(dirname, '../../common-js-utils/dist/esm'),
  path.join(dirname, '../../common-js-utils/dist/assets'),
  path.join(dirname, '../../common-js-utils/dist/styles'),
  path.join(dirname, '../../common-js-utils-flow/dist/cjs'),
  path.join(dirname, '../../common-js-utils-flow/dist/esm'),
  path.join(dirname, '../../common-js-utils-flow/dist/assets'),
  path.join(dirname, '../../common-js-utils-flow/dist/styles'),
  path.join(dirname, '../../../test-apps/common-js-utils/dist'),
  path.join(dirname, '../../../test-apps/common-js-utils-flow/dist'),
];

export default projectsPaths;
