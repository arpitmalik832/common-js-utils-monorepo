/* eslint-disable no-console */
/**
 * Script to compare the size of two benchmark results.
 * @file This file is saved as `size_compare.js`.
 */
import fs from 'fs';

/**
 * Read a JSON file and return the parsed data.
 * @param {string} filePath - The path to the JSON file.
 * @returns {object} The parsed data.
 * @example
 * const data = readJsonFile('./path/to/file.json');
 */
function readJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Merge two benchmark results.
 * @param {object} base - The base benchmark results.
 * @param {object} patch - The patch benchmark results.
 * @returns {object} The merged results.
 * @example
 * const merged = mergeData(base, patch);
 */
function mergeData(base, patch) {
  const merged = {};

  /**
   * Add data to the merged results.
   * @param {object} data - The data to add.
   * @param {number} fileIndex - The index of the file.
   * @example
   * addToMerged(base, 1);
   * addToMerged(patch, 2);
   */
  function addToMerged(data, fileIndex) {
    Object.keys(data).forEach(key => {
      if (merged[key] == null) {
        merged[key] = {};
      }
      Object.keys(data[key]).forEach(subKey => {
        if (merged[key][subKey] == null) {
          merged[key][subKey] = {};
        }
        merged[key][subKey][fileIndex] = data[key][subKey];
      });
    });
  }
  if (base != null) {
    addToMerged(base, 1);
  }
  if (patch != null) {
    addToMerged(patch, 2);
  }
  return merged;
}

/**
 * Generate comparison data.
 * @param {object} results - The results to generate comparison data from.
 * @returns {object} The comparison data.
 * @example
 * const comparisonData = generateComparisonData(results);
 */
function generateComparisonData(results) {
  const baseResult = parseInt(results[1], 10);
  const patchResult = parseInt(results[2], 10);
  const isValidBase = !Number.isNaN(baseResult);
  const isValidPatch = !Number.isNaN(patchResult);
  let icon = '';
  let ratioFixed = '';

  if (isValidBase && isValidPatch) {
    const ratio = patchResult / baseResult;
    ratioFixed = ratio.toFixed(2);
    if (ratio < 0.95 || ratio > 1.05) {
      icon = '**!!**';
    } else if (ratio < 1) {
      icon = '-';
    } else if (ratio > 1) {
      icon = '+';
    }
  }

  return {
    baseResult: isValidBase ? baseResult.toLocaleString() : '',
    patchResult: isValidPatch ? patchResult.toLocaleString() : '',
    ratio: ratioFixed,
    icon,
  };
}

/**
 * Generate a markdown table from the merged data.
 * @param {object} mergedData - The merged data to generate the table from.
 * @returns {string} The markdown table.
 * @example
 * const markdownTable = generateMarkdownTable(mergedData);
 */
function generateMarkdownTable(mergedData) {
  const rows = [];
  rows.push('| **Results** | **Base** | **Patch** | **Ratio** |  |');
  rows.push('| :--- | ---: | ---: | ---: | ---: |');
  Object.keys(mergedData).forEach(suiteName => {
    rows.push('|  |  |  |  |');
    rows.push(`| **${suiteName}** |  |  |  |  |`);
    Object.keys(mergedData[suiteName]).forEach(test => {
      const results = mergedData[suiteName][test];
      const { baseResult, patchResult, ratio, icon } =
        generateComparisonData(results);
      rows.push(
        `| &middot; ${test} | ${baseResult} | ${patchResult} | ${ratio} | ${icon} |`,
      );
    });
  });
  return rows.join('\n');
}

const args = process.argv.slice(2);
const baseResults = args[0] ? readJsonFile(args[0]) : null;
const patchResults = args[1] ? readJsonFile(args[1]) : null;
const mergedData = mergeData(baseResults, patchResults);
const markdownTable = generateMarkdownTable(mergedData);

const outputPath = process.argv[3] || 'markdown-table.md';
fs.writeFileSync(outputPath, markdownTable);

console.log('Results:', markdownTable);
console.log('Results written to', outputPath);
