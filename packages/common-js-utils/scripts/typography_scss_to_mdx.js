/* eslint-disable no-console */
/**
 * This script extracts typography SCSS variables and saves them to an MDX file.
 * @file This script is saved as `typography_scss_to_mdx.js`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the config directory.
 * @returns {string} The config directory.
 * @example
 * const dirname = getConfigDir();
 */
function getConfigDir() {
  if (typeof __dirname !== 'undefined') {
    // CommonJS environment
    return __dirname;
  }
  // ESM environment
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
}

const dirname = getConfigDir();

// Paths to the source SCSS file and target MDX file
const scssFilePath = path.join(
  dirname,
  '../static/styles/style-dictionary/typography.scss',
);
const mdxFilePath = path.join(dirname, '../src/stories/Typography/index.mdx');

// Read the SCSS file
const scssContent = fs.readFileSync(scssFilePath, 'utf8');

// Read the existing MDX file
let mdxContent = fs.readFileSync(mdxFilePath, 'utf8');

// Create a markdown code block with the SCSS content
const scssCodeBlock = `\`\`\`scss\n${scssContent}\n\`\`\``;

// Replace a placeholder in the MDX file with the SCSS code block
mdxContent = mdxContent.replace(
  '-- SCSS_CONTENT_PLACEHOLDER --',
  scssCodeBlock,
);

// Write the updated content back to the MDX file
fs.writeFileSync(mdxFilePath, mdxContent);

console.log('SCSS content has been copied to the MDX file.');
