/* eslint-disable no-console */
/**
 * This script updates the typography SCSS file to use the correct import path.
 * @file This script is saved as `updateImportForMixins.js`.
 */
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Updates the typography SCSS file to use the correct import path.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @example
 * updateTypographyUse().then(() => {
 *   console.log('Update completed');
 * });
 */
async function updateTypographyUse() {
  const filePath = join('dist', 'styles', 'mixins', 'typography.scss');
  try {
    let content = await readFile(filePath, 'utf8');
    content = content.replace(
      "@use '../../../static/styles/style-dictionary/typography' as t;",
      "@use '../style-dictionary/typography' as t;",
    );
    await writeFile(filePath, content, 'utf8');
    console.log('typography.scss updated successfully');
  } catch (error) {
    console.error('Error updating typography.scss ->', error);
  }
}

updateTypographyUse();
