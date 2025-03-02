/**
 * This file is used to configure storybook.
 * @file This file is saved as '.storybook/main.js'.
 */
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

import { ENVS } from '../build_utils/config/index.mjs';
import svgrConfig from '../svgr.config.mjs';
import { ERR_NO_STORY_ENV_FLAG } from '../build_utils/config/logs.mjs';
import bundleAnalyzerConfig from '../build_utils/webpack/configs/webpack.bundleanalyzer.mjs';
import buildStatsConfig from '../build_utils/webpack/configs/webpack.buildstats.mjs';

export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
    'storybook-addon-render-modes',
  ],
  framework: '@storybook/react-webpack5',
  webpackFinal: async config => {
    if (!process.env.STORY_ENV) {
      throw new Error(ERR_NO_STORY_ENV_FLAG);
    }

    const newConfig = { ...config };

    const isRelease = process.env.STORY_ENV === ENVS.PROD;
    const isBeta = process.env.STORY_ENV === ENVS.BETA;

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
        'postcss-loader',
        'sass-loader',
      ],
    });

    // adding code splitting
    newConfig.optimization = {
      ...newConfig.optimization,
      minimize: isRelease || isBeta,
      minimizer:
        isRelease || isBeta
          ? [
              new TerserPlugin({
                terserOptions: {
                  compress: {
                    inline: false,
                    drop_console: !!isRelease,
                    dead_code: true,
                    drop_debugger: !!isRelease,
                    conditionals: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    keep_fargs: false,
                    hoist_vars: true,
                    if_return: true,
                    join_vars: true,
                    side_effects: true,
                    warnings: false,
                  },
                  mangle: true,
                  output: {
                    comments: false,
                  },
                },
              }),
              new CssMinimizerPlugin({
                minimizerOptions: {
                  preset: [
                    'default',
                    {
                      discardComments: { removeAll: true },
                    },
                  ],
                },
              }),
            ]
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

    const addVisualizer = process.env.INCLUDE_VISUALIZER === 'true';
    const addBuildStats = process.env.INCLUDE_BUILD_STATS === 'true';

    // adding visualizer plugin
    if (addVisualizer) {
      newConfig.plugins.push(bundleAnalyzerConfig.plugins[0]);
    }

    // adding build stats plugin
    if (addBuildStats) {
      newConfig.plugins.push(buildStatsConfig.plugins[0]);
    }

    return newConfig;
  },
};
