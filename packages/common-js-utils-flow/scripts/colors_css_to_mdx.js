/* eslint-disable no-console */
/**
 * This script extracts color variables from a CSS file and saves them to an MDX file.
 * @file This script is saved as `colors_css_to_mdx.js`.
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

/**
 * Removes duplicate values from an array.
 * @param {Array} array - The array to deduplicate.
 * @returns {Array} A new array with duplicate values removed.
 * @example
 * const uniqueArray = deduplicate([1, 2, 2, 3]); // [1, 2, 3]
 */
function deduplicate(array) {
  return [...new Set(array)];
}

// Path to your CSS file
const cssFilePath = path.join(
  dirname,
  '../static/styles/postcss-processed/index.css',
);

// Path to your mdx file
const mdxFilePath = path.join(dirname, '../src/stories/Colors/index.mdx');

// Read the CSS file
const cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Regular expression to match color custom properties
const colorRegex =
  /--(background)-[a-zA-Z0-9-]+:\s*(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\)|rgba\([^)]+\)|[a-zA-Z]+)/g;

// Extract color variables
const colorVariables = [];
let res = [];
let match;
while (colorRegex.exec(cssContent) !== null) {
  match = colorRegex.exec(cssContent);
  const [fullMatch] = match;
  const variableName = fullMatch.split(':')[0].trim();
  colorVariables.push(variableName);

  res = deduplicate(colorVariables);
}

// Create a markdown code block with the SCSS content
const scssCodeBlock = `\`\`\`scss\n${res.map((i, ind) => `${ind !== 0 ? '\n' : ''}${i}`).join('')}\n\`\`\``;

// Read the existing MDX file
let mdxContent = fs.readFileSync(mdxFilePath, 'utf8');

// Replace a placeholder in the MDX file with the SCSS code block
mdxContent = mdxContent.replace('-- CSS_COLOR_CONTENT --', scssCodeBlock);

// Write the updated content back to the MDX file
fs.writeFileSync(mdxFilePath, mdxContent);

console.log(`Color variables have been extracted and saved to mdx file`);
