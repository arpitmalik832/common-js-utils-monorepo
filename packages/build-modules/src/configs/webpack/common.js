/**
 * Webpack common configuration for both development and production environments.
 * @file The file is saved as `build_utils/webpack/webpack.common.js`.
 */
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { getPaths } from '../../utils/index.js';
import { MAIN_ENUMS } from '../../enums/index.js';
import svgrConfig from '../svgrConfig.js';

/**
 * Generates the Webpack common configuration for both development and production environments.
 * @param {string} projectRoot - The project root directory.
 * @param {object} pkg - The package.json object.
 * @param {string} env - The environment variable.
 * @param {string} envVariableName - The environment variable name.
 * @param {string} filename - The filename.
 * @returns {object} The Webpack configuration object.
 * @example
 * const config = getConfig();
 */
function getConfig(projectRoot, pkg, env, envVariableName, filename) {
  const isBeta = env === MAIN_ENUMS.ENVS.BETA;
  const isRelease = env === MAIN_ENUMS.ENVS.PROD;

  const { entryPath, outputPath } = getPaths(projectRoot);
  return {
    entry: entryPath,
    output: {
      uniqueName: pkg.name,
      publicPath: '/',
      path: outputPath,
      filename: `${pkg.version}/js/[name].[chunkhash:8].js`,
      chunkFilename: `${pkg.version}/js/[name].[chunkhash:8].js`,
      assetModuleFilename: `${pkg.version}/assets/[name].[contenthash:8][ext]`,
      crossOriginLoading: 'anonymous',
    },
    cache: {
      type: 'filesystem',
      version: `${pkg.version}_${env}`,
      store: 'pack',
      buildDependencies: {
        config: [filename],
      },
    },
    devtool: isRelease || isBeta ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /node_modules/,
          resolve: {
            fullySpecified: false,
          },
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins:
                  isRelease || isBeta
                    ? [
                        [
                          'transform-react-remove-prop-types',
                          {
                            removeImport: true,
                          },
                        ],
                      ]
                    : [],
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: svgrConfig,
            },
            'url-loader',
          ],
        },
        {
          test: /\.(scss|sass)$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
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
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
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
          ],
        },
      ],
    },
    performance: {
      hints: isRelease || isBeta ? 'error' : 'warning',
      maxAssetSize: 250000,
      maxEntrypointSize: 10000000,
    },
    optimization: {
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
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxSize: 200 * 1024, // 200 KB
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const moduleName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )?.[1];
              if (moduleName) {
                return `vendor${moduleName}`;
              }
              return 'vendor';
            },
            chunks: 'all',
            priority: -10,
            reuseExistingChunk: true,
            enforce: true,
            maxInitialRequests: 30,
            maxAsyncRequests: 30,
          },
        },
      },
      usedExports: true,
      sideEffects: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        [envVariableName]: JSON.stringify(env),
      }),
      new Dotenv({
        path: `./.env.${env}`,
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        favicon: 'public/favicon.ico',
      }),
      new MiniCssExtractPlugin({
        filename: `${pkg.version}/css/[name].[chunkhash:8].css`,
        chunkFilename: `${pkg.version}/css/[name].[chunkhash:8].css`,
        ignoreOrder: true,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public/netlify',
          },
        ],
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
    },
  };
}

export default getConfig;
