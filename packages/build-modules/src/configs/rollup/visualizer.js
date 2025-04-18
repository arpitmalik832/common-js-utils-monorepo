/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Generates a Rollup configuration with visualizer plugins.
 * @param {string} dirPath - The directory path to save the visualizers.
 * @param {string} type - The type of build (e.g., 'svgr' or 'main').
 * @param {string} env - The environment variable to check.
 * @returns {object} Rollup configuration object.
 * @example
 * const config = getConfig(dirPath, type, env);
 */
function getConfig(dirPath, type, env) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const path = `${dirPath}/${type}/${env}/visualizers/${timestamp}`;

  return {
    plugins: [
      visualizer({
        filename: `${path}/flamegraph.html`,
        template: 'flamegraph',
      }),
      visualizer({
        filename: `${path}/list.html`,
        template: 'list',
      }),
      visualizer({
        filename: `${path}/network.html`,
        template: 'network',
      }),
      visualizer({
        filename: `${path}/raw-data.html`,
        template: 'raw-data',
      }),
      visualizer({
        filename: `${path}/sunburst.html`,
        template: 'sunburst',
      }),
      visualizer({
        filename: `${path}/treemap.html`,
        template: 'treemap',
      }),
    ],
  };
}

export default getConfig;
