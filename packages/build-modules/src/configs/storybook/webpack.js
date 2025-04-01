/**
 * Storybook configuration.
 * @file This file is saved as `.storybook/main.js`.
 */
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';

import {
  getBundleAnalyzerConfig,
  getBuildStatsConfig,
  getMinimizerConfig,
} from '../webpack/index.js';
import { MAIN_ENUMS } from '../../enums/index.js';
import svgrConfig from '../svgrConfig.js';
import { getDirname } from '../../utils/index.js';

const dirname = getDirname();

/**
 * Get the storybook configuration.
 * @param {string} projectRoot - The project root.
 * @param {string} bundleAnalyzerPath - The path to the bundle analyzer.
 * @param {string} buildStatsPath - The path to the build stats.
 * @param {string} env - The environment.
 * @param {string} includeBundleAnalyzer - Whether to include the bundle analyzer.
 * @param {string} includeBuildStats - Whether to include the build stats.
 * @param {string} ERR_NO_STORY_ENV_FLAG - The error message for no story env.
 * @returns {object} The storybook configuration.
 * @example
 * const config = getConfig(process.cwd());
 */
function getConfig(
  projectRoot,
  bundleAnalyzerPath,
  buildStatsPath,
  env,
  includeBundleAnalyzer,
  includeBuildStats,
  ERR_NO_STORY_ENV_FLAG,
) {
  return {
    stories: [
      `${projectRoot}/src/**/*.stories.@(js|jsx|ts|tsx)`,
      `${projectRoot}/src/**/*.mdx`,
    ],
    addons: [
      '@storybook/addon-essentials',
      '@storybook/addon-links',
      '@storybook/addon-a11y',
      '@storybook/addon-interactions',
      '@storybook/addon-storysource',
      'storybook-addon-render-modes',
    ],
    framework: '@storybook/react-webpack5',
    webpackFinal: config => {
      if (!env) {
        throw new Error(ERR_NO_STORY_ENV_FLAG);
      }

      const newConfig = { ...config };

      const isRelease = env === MAIN_ENUMS.ENVS.PROD;
      const isBeta = env === MAIN_ENUMS.ENVS.BETA;

      // adding handling for js files
      newConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      });

      // adding handling for svg files
      const fileLoaderRule = newConfig.module.rules.find(
        rule => !Array.isArray(rule.test) && rule.test.test('.svg'),
      );
      fileLoaderRule.exclude = /\.svg$/;
      newConfig.module.rules.push({
        test: /\.svg$/,
        use: [{ loader: '@svgr/webpack', options: svgrConfig }, 'url-loader'],
      });

      // adding handling for sass and scss files
      newConfig.module.rules.push({
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: {
                mode: 'local',
                localIdentName:
                  isRelease || isBeta
                    ? '[hash:base64:5]'
                    : '[name]-[local]-[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config:
                  `${projectRoot}/postcssConfig.js` ??
                  `${projectRoot}/postcssConfig.mjs` ??
                  path.resolve(dirname, '../postcssConfig.js'),
                //  [ `${projectRoot}/postcssConfig.mjs`,
                //   path.resolve(dirname, '../postcssConfig.js'),
                // ],
                ctx: {
                  env:
                    isRelease || isBeta
                      ? MAIN_ENUMS.ENVS.PROD
                      : MAIN_ENUMS.ENVS.STG,
                },
              },
            },
          },
          'sass-loader',
        ],
      });

      // adding code splitting
      newConfig.optimization = {
        ...newConfig.optimization,
        minimize: isRelease || isBeta,
        minimizer:
          isRelease || isBeta
            ? getMinimizerConfig(env).optimization.minimizer
            : [],
        splitChunks: {
          chunks: 'all',
          maxSize: 200 * 1024, // 200 KB
        },
      };

      // adding compression plugin
      newConfig.plugins.push(
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css)$/,
        }),
      );

      const addVisualizer = includeBundleAnalyzer === 'true';
      const addBuildStats = includeBuildStats === 'true';

      // adding visualizer plugin
      if (addVisualizer) {
        newConfig.plugins.push(
          getBundleAnalyzerConfig(bundleAnalyzerPath, 'storybook', env)
            .plugins[0],
        );
      }

      // adding build stats plugin
      if (addBuildStats) {
        newConfig.plugins.push(
          getBuildStatsConfig(buildStatsPath, 'storybook', env).plugins[0],
        );
      }

      return newConfig;
    },
  };
}

export default getConfig;
