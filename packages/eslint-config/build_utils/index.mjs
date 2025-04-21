function e() {
  let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
  const s = e?.env || 'development';
  return {
    plugins: {
      'postcss-preset-env': {},
      autoprefixer: {},
      'postcss-flexbugs-fixes': {},
      cssnano: ('production' === s || 'beta' === s) && {},
    },
  };
}
function s() {
  process.env.APP_ENV !== ge.PROD && console.log(...arguments);
}
function t() {
  process.env.APP_ENV !== ge.PROD && console.error(...arguments);
}
function o() {
  process.env.APP_ENV !== ge.PROD && console.warn(...arguments);
}
function n() {
  process.env.APP_ENV !== ge.PROD && console.debug(...arguments);
}
function i() {
  process.env.APP_ENV !== ge.PROD && console.trace(...arguments);
}
function r() {
  if (process.env.APP_ENV !== ge.PROD) {
    for (var e = arguments.length, s = new Array(e), t = 0; t < e; t++)
      s[t] = arguments[t];
    console.table(s);
  }
}
function a() {
  process.env.APP_ENV !== ge.PROD && console.info(...arguments);
}
function l(e) {
  const s = x.join(e, 'src', 'index.js'),
    t = x.join(e, 'dist');
  return {
    entryPath: s,
    outputPath: t,
    typesPath: x.join(e, 'types'),
    stylesOutputPath: x.join(t, 'index.css'),
    typographyMixinPath: x.join(
      e,
      'dist',
      'styles',
      'mixins',
      'typography.scss',
    ),
    iconsPath: x.join(e, 'src', 'assets', 'icons'),
    iconsListPath: x.join(e, 'static', 'enums', 'icons_list.mjs'),
  };
}
function c(e, s, t) {
  const o = new Date(),
    n = `${o.getFullYear()}${String(o.getMonth() + 1).padStart(2, '0')}${String(o.getDate()).padStart(2, '0')}-${String(o.getHours()).padStart(2, '0')}${String(o.getMinutes()).padStart(2, '0')}`;
  return O.existsSync(e) || O.mkdirSync(e), `${e}/${s}-${n}.${t}`;
}
function u() {
  let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
  if (e)
    try {
      return e.startsWith('file://') ? x.dirname(F(e)) : x.dirname(e);
    } catch (s) {
      return t('getting error ->', s), x.dirname(e);
    }
  if ('undefined' != typeof __dirname) return __dirname;
  try {
    return x.dirname(F(import.meta.url));
  } catch (e) {
    return t('getting error ->', e), process.cwd();
  }
}
async function p(e) {
  const s = x.extname(e).toLowerCase(),
    o = await T.readFile(e, 'utf8'),
    n = {
      preset: [
        'default',
        {
          discardComments: { removeAll: !0 },
          normalizeWhitespace: !0,
          minifySelectors: !0,
          reduceIdents: !0,
          reduceInitial: !0,
          mergeLonghand: !0,
          mergeRules: !0,
          minifyFontValues: !0,
          minifyGradients: !0,
          minifyParams: !0,
          normalizePositions: !0,
          normalizeRepeatStyle: !0,
          normalizeString: !0,
          normalizeTimingFunctions: !0,
          normalizeUnicode: !0,
          normalizeUrl: !0,
          orderedValues: !0,
          reduceBackgroundRepeat: !0,
          reducePositions: !0,
          reduceTransforms: !0,
          styleCache: !0,
          calc: { preserve: !1, precision: 2 },
          colormin: { reduce: !0 },
          zindex: { startIndex: 1 },
          convertValues: { length: !0, time: !0, angle: !0 },
          uniqueSelectors: !0,
          mergeIdents: !0,
          discardDuplicates: !0,
          discardOverridden: !0,
          discardUnused: !0,
          mergeMedia: !0,
        },
      ],
    };
  try {
    switch (s) {
      case '.js':
      case '.mjs':
      case '.jsx':
      case '.ts':
      case '.tsx': {
        const s = await A(o, {
          compress: {
            dead_code: !0,
            drop_debugger: !0,
            drop_console: !1,
            conditionals: !0,
            evaluate: !0,
            booleans: !0,
            loops: !0,
            unused: !0,
            hoist_funs: !0,
            keep_fargs: !1,
            hoist_vars: !0,
            if_return: !0,
            join_vars: !0,
            side_effects: !0,
          },
          mangle: !0,
        });
        await T.writeFile(e, s.code);
        break;
      }
      case '.css': {
        const s = await M([N(n)]).process(o, { from: e, map: !1 });
        await T.writeFile(e, s.css);
        break;
      }
      case '.scss':
      case '.sass': {
        const s = await M([N(n)]).process(o, { from: e, map: !1, syntax: W });
        await T.writeFile(e, s.css);
        break;
      }
    }
  } catch (s) {
    t(`Error minifying ${e}:`, s);
  }
}
async function m(e) {
  try {
    if ((await T.stat(e)).isDirectory()) {
      const s = await T.readdir(e, { recursive: !0 });
      await Promise.all(
        s.map(async s => {
          const t = x.join(e, s);
          (await T.stat(t)).isFile() && (await p(t));
        }),
      );
    } else await p(e);
  } catch (s) {
    t(`Error processing path ${e}:`, s);
  }
}
function d() {
  return {
    [ge.PROD]: 'https://proj-x.com/',
    [ge.BETA]: 'https://proj-x-beta.com/',
    [ge.STG]: 'https://proj-x-stg.com/',
    [ge.DEV]: 'https://proj-x-dev.com/',
    [ge.DEFAULT]: 'https://proj-x-stg.com/',
  };
}
function f(e) {
  const s = {};
  return (
    (arguments.length > 1 && void 0 !== arguments[1]
      ? arguments[1]
      : []
    ).forEach(t => {
      s[t] = d()[e];
    }),
    { ...s }
  );
}
function g(e) {
  let s;
  return {
    name: 'build-stats-plugin',
    buildStart() {
      s = Date.now();
    },
    generateBundle(t, o) {
      const n = {
        files: [],
        totalSize: 0,
        totalGzippedSize: 0,
        totalBrotliSize: 0,
        totalMinifiedSize: 0,
        buildDuration: Date.now() - s,
        noOfFiles: 0,
        largestFile: null,
      };
      Object.entries(o)
        .filter(e => {
          let [s] = e;
          return !s.endsWith('.map') && !s.endsWith('.br');
        })
        .forEach(e => {
          let [s, t] = e,
            o = '';
          t.code
            ? (o = t.code)
            : t.source
              ? (o = t.source)
              : 'string' == typeof t && (o = t);
          let i = '';
          if (
            ((s.endsWith('.js') || s.endsWith('.mjs')) &&
              (i = R(o, { compress: !0, mangle: !0 })),
            s.endsWith('.css') || s.endsWith('.scss'))
          ) {
            const e = o.toString('utf8');
            i = new B().minify(e).styles;
          }
          const r = Buffer.byteLength(o, 'utf8'),
            a = C.gzipSync(o).length,
            l = C.brotliCompressSync(o).length,
            c = Buffer.byteLength(i, 'utf8');
          n.files.push({
            fileName: s,
            size: r,
            gzippedSize: a,
            brotliSize: l,
            minifiedSize: c,
            contentType: t.type || 'unknown',
          }),
            (n.totalSize += r),
            (n.totalGzippedSize += a),
            (n.totalBrotliSize += l),
            (n.totalMinifiedSize += c);
        }),
        (n.noOfFiles = n.files.length),
        n.files.length > 0 &&
          ((n.files = n.files.map(e => ({
            ...e,
            percentageBySize: ((e.size / n.totalSize) * 100).toFixed(2),
          }))),
          (n.largestFile = n.files.reduce(
            (e, s) => (e.size > s.size ? e : s),
            n.files[0],
          )));
      const i = e || c(`${process.cwd()}/.logs`, 'build-stats', 'json');
      O.mkdirSync(x.dirname(i), { recursive: !0 }),
        O.writeFileSync(i, JSON.stringify(n, null, 2));
    },
  };
}
function h(e) {
  return V({ targets: e });
}
function b(e) {
  let {
    include: s = ['**/*.{cjs,mjs,js,jsx,ts,tsx}'],
    variables: t = [],
    exclude: o = [],
  } = e;
  const n = I(s, o);
  return {
    name: 'strip-custom-window-variables-plugin',
    transform(e, s) {
      if (!n(s)) return null;
      const o = G(e, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
      ye(o, {
        MemberExpression(e) {
          const { node: s } = e;
          s.object &&
            'window' === s.object.name &&
            s.property &&
            s.property.name &&
            t.includes(s.property.name) &&
            (console.log(
              `\nRemoving window variable: ${s.object.name}.${s.property.name}`,
            ),
            e.remove());
        },
        AssignmentExpression(e) {
          const { node: s } = e;
          s.left &&
            s.left.object &&
            'window' === s.left.object.name &&
            s.left.property &&
            s.left.property.name &&
            t.includes(s.left.property.name) &&
            (console.log(
              `\nRemoving window variable assignment: ${s.left.object.name}.${s.left.property.name}`,
            ),
            e.remove());
        },
      });
      const i = we(o, {}, e);
      return { code: i.code, map: i.map };
    },
  };
}
function y(e, s) {
  return {
    name: 'minimize-plugin',
    async writeBundle() {
      try {
        [ge.PROD, ge.BETA].includes(s) && (await Promise.all(e.map(e => m(e))));
      } catch (e) {
        t('Error in MinimizePlugin:', e);
      }
    },
  };
}
function w(e, s, t) {
  const o = new Date().toISOString().replace(/:/g, '-');
  return {
    plugins: [
      new je({ outputPath: `${`${e}/${s}/${t}/buildStats`}/${o}.json` }),
    ],
  };
}
function j(e, s, t) {
  const o = new Date().toISOString().replace(/:/g, '-'),
    n = `${e}/${s}/${t}/visualizer/`;
  return {
    plugins: [
      new ie({
        analyzerMode: 'static',
        reportFilename: x.resolve(n, `${o}.html`),
        openAnalyzer: !1,
      }),
    ],
  };
}
function v(e) {
  return {
    optimization: {
      minimize: !0,
      minimizer: [
        new re({
          terserOptions: {
            compress: {
              inline: !1,
              drop_console: e === ge.PROD,
              dead_code: !0,
              drop_debugger: e === ge.PROD,
              conditionals: !0,
              evaluate: !0,
              booleans: !0,
              loops: !0,
              unused: !0,
              hoist_funs: !0,
              keep_fargs: !1,
              hoist_vars: !0,
              if_return: !0,
              join_vars: !0,
              side_effects: !0,
              warnings: !1,
            },
            mangle: !0,
            output: { comments: !1 },
          },
        }),
        new ae({
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: !0 } }],
          },
        }),
      ],
    },
  };
}
var P, S, z, _, $, k;
import x from 'path';
import O, { mkdirSync as D, writeFileSync as E } from 'fs';
import C from 'zlib';
import { minify as A, minify_sync as R } from 'terser';
import B from 'clean-css';
import { fileURLToPath as F } from 'url';
import T from 'fs/promises';
import N from 'cssnano';
import M from 'postcss';
import W from 'postcss-scss';
import V from 'rollup-plugin-copy';
import { createFilter as I } from '@rollup/pluginutils';
import { parse as G } from '@babel/parser';
import L from '@babel/traverse';
import q from '@babel/generator';
import U from 'webpack';
import J from '@rollup/plugin-node-resolve';
import H from '@rollup/plugin-commonjs';
import Y from '@rollup/plugin-babel';
import K from '@svgr/rollup';
import Q from '@rollup/plugin-url';
import X from '@rollup/plugin-image';
import Z from 'rollup-plugin-postcss';
import ee from '@rollup/plugin-json';
import se from 'rollup-plugin-progress';
import te from '@rollup/plugin-terser';
import { visualizer as oe } from 'rollup-plugin-visualizer';
import ne from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin as ie } from 'webpack-bundle-analyzer';
import re from 'terser-webpack-plugin';
import ae from 'css-minimizer-webpack-plugin';
import { InjectManifest as le } from 'workbox-webpack-plugin';
import ce from 'dotenv-webpack';
import ue from 'copy-webpack-plugin';
import pe from 'html-webpack-plugin';
import me from 'mini-css-extract-plugin';
import de from 'webpack-assets-manifest';
const fe = {
    prettier: !0,
    svgo: !0,
    exportType: 'named',
    svgoConfig: {
      plugins: [
        {
          name: 'preset-default',
          params: { overrides: { removeViewBox: !1 } },
        },
      ],
    },
    titleProp: !0,
    ref: !0,
    outputDir: 'dist/assets',
    icon: !1,
  },
  ge = { PROD: 'production', BETA: 'beta', STG: 'staging', DEV: 'development' };
P = Object.freeze({ __proto__: null, ENVS: ge });
const he = e => {
    process.env.APP_ENV !== ge.PROD && console.time(e);
  },
  be = e => {
    process.env.APP_ENV !== ge.PROD && console.timeEnd(e);
  },
  ye = L.default,
  we = q.default;
S = Object.freeze({
  __proto__: null,
  BuildStatsPlugin: g,
  CopyPlugin: h,
  ImportStylesPlugin: function (e) {
    return {
      name: 'import-styles-plugin',
      generateBundle(s, t) {
        const o = '../index.css';
        Object.entries(t).forEach(s => {
          let [n, i] = s,
            r = i.code;
          'esm/lib.js' === n
            ? (r = `import "${o}";${[ge.PROD, ge.BETA].includes(e) ? '' : '\n'}${i.code}`)
            : 'cjs/lib.js' === n &&
              (r = `require("${o}");${[ge.PROD, ge.BETA].includes(e) ? '' : '\n'}${i.code}`),
            Object.defineProperty(t[n], 'code', { value: r });
        });
      },
    };
  },
  MinimizePlugin: y,
  StripCustomWindowVariablesPlugin: b,
});
class je {
  constructor() {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    (this.outputPath =
      e.outputPath || c(`${process.cwd()}/.logs`, 'build-stats', 'json')),
      (this.startTime = 0),
      (this.stats = {
        files: [],
        totalSize: 0,
        totalGzippedSize: 0,
        totalBrotliSize: 0,
        totalMinifiedSize: 0,
        noOfFiles: 0,
        largestFile: null,
        buildDuration: 0,
      });
  }
  apply(e) {
    e.hooks.beforeCompile.tap('BuildStatsPlugin', () => {
      this.startTime = Date.now();
    }),
      e.hooks.done.tap('BuildStatsPlugin', () => {
        (this.stats.buildDuration = Date.now() - this.startTime),
          D(x.dirname(this.outputPath), { recursive: !0 }),
          E(this.outputPath, JSON.stringify(this.stats, null, 2));
      }),
      e.hooks.emit.tapAsync('BuildStatsPlugin', (e, s) => {
        Object.keys(e.assets)
          .filter(e => !e.endsWith('.map') && !e.endsWith('.br'))
          .forEach(s => {
            const t = e.assets[s];
            let o = '';
            if (
              ((s.endsWith('.js') || s.endsWith('.mjs')) &&
                (o = R(t.source(), { compress: !0, mangle: !0 })),
              s.endsWith('.css') || s.endsWith('.scss'))
            ) {
              const e = t.source().toString('utf8');
              o = new B().minify(e).styles;
            }
            const n = t.size(),
              i = C.gzipSync(t.source()).length,
              r = C.brotliCompressSync(t.source()).length,
              a = Buffer.byteLength(o, 'utf8');
            let l = 'asset';
            e.chunkGroups.forEach(e => {
              e.chunks.forEach(e => {
                e.files.has(s) && (l = 'chunk');
              });
            }),
              this.stats.files.push({
                fileName: s,
                size: n,
                gzippedSize: i,
                brotliSize: r,
                minifiedSize: a,
                contentType: l,
              }),
              (this.stats.totalSize += n),
              (this.stats.totalGzippedSize += i),
              (this.stats.totalBrotliSize += r),
              (this.stats.totalMinifiedSize += a);
          }),
          (this.stats.noOfFiles = this.stats.files.length),
          this.stats.files.length > 0 &&
            ((this.stats.files = this.stats.files.map(e => ({
              ...e,
              percentageBySize: ((e.size / this.stats.totalSize) * 100).toFixed(
                2,
              ),
            }))),
            (this.stats.largestFile = this.stats.files.reduce(
              (e, s) => (e.size > s.size ? e : s),
              this.stats.files[0],
            ))),
          s();
      });
  }
}
class ve {
  constructor(e) {
    let { variables: s } = e;
    this.variables = s || [];
  }
  apply(e) {
    e.hooks.compilation.tap('StripCustomWindowVariablesPlugin', e => {
      e.hooks.processAssets.tap(
        {
          name: 'StripCustomWindowVariablesPlugin',
          stage: e.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        e => {
          Object.keys(e).forEach(s => {
            if (s.endsWith('.js')) {
              let t = e[s].source();
              this.variables.forEach(e => {
                const s = new RegExp(`window\\.${e}\\s*=\\s*[^;]+;`, 'g');
                t = t.replace(s, '');
              }),
                (e[s] = new U.sources.RawSource(t));
            }
          });
        },
      );
    });
  }
}
(z = Object.freeze({
  __proto__: null,
  BuildStatsPlugin: je,
  StripCustomWindowVariablesPlugin: ve,
})),
  (_ = Object.freeze({
    __proto__: null,
    getBuildStatsConfig: function (e, s, t) {
      const o = new Date().toISOString().replace(/:/g, '-'),
        n = e ? e.replace(/\/+$/, '') : '';
      return {
        plugins: [
          g(
            x.posix.join(
              n.startsWith('/') ? n : `/${n}`,
              s,
              t,
              'buildStats',
              `${o}.json`,
            ),
          ),
        ],
      };
    },
    getMainConfig: function (e, s, t, o, n) {
      const i = l(e),
        r = u();
      return {
        input: i.entryPath,
        output: [
          {
            dir: i.outputPath,
            format: 'esm',
            sourcemap: ![ge.PROD, ge.BETA].includes(s),
            entryFileNames: 'esm/lib.js',
          },
          {
            dir: i.outputPath,
            format: 'cjs',
            sourcemap: ![ge.PROD, ge.BETA].includes(s),
            entryFileNames: 'cjs/lib.js',
          },
        ],
        external: [/node_modules/],
        plugins: [
          J({
            extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
            preferBuiltins: !0,
            mainFields: ['module', 'main'],
            modulesOnly: !0,
          }),
          Y({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            configFile: './babel.config.cjs',
            extensions: ['.js', '.jsx'],
          }),
          H({ extensions: ['.js', '.jsx'] }),
          [ge.PROD, ge.BETA].includes(s) && b({ variables: [...t] }),
          Z({
            extensions: ['.css', '.scss'],
            extract: i.stylesPath,
            minimize: [ge.PROD, ge.BETA].includes(s),
            modules: !0,
            use: ['sass'],
            config: {
              path: [
                `${e}/postcss.config.js`,
                `${e}/postcss.config.mjs`,
                x.resolve(r, '../postcssConfig.js'),
              ],
              ctx: { env: [ge.PROD, ge.BETA].includes(s) ? ge.PROD : ge.STG },
            },
          }),
          X(),
          Q(),
          K(fe),
          h(o),
          y(n, s),
          ee(),
          se(),
        ],
      };
    },
    getMinimizerConfig: function () {
      return {
        plugins: [
          te({
            compress: {
              dead_code: !0,
              drop_debugger: !0,
              drop_console: !1,
              conditionals: !0,
              evaluate: !0,
              booleans: !0,
              loops: !0,
              unused: !0,
              hoist_funs: !0,
              keep_fargs: !1,
              hoist_vars: !0,
              if_return: !0,
              join_vars: !0,
              side_effects: !0,
            },
            mangle: !0,
          }),
        ],
      };
    },
    getSvgrMainConfig: function (e, s, t) {
      const o = l(e);
      return {
        input: t.map(e => `src/assets/icons/${e}`),
        output: [
          {
            dir: o.outputPath,
            format: 'esm',
            sourcemap: ![ge.PROD, ge.BETA].includes(s),
            preserveModules: !0,
            preserveModulesRoot: 'src',
            entryFileNames: 'esm/[name].js',
            chunkFileNames: 'esm/[name].js',
          },
          {
            dir: o.outputPath,
            format: 'cjs',
            sourcemap: ![ge.PROD, ge.BETA].includes(s),
            preserveModules: !0,
            preserveModulesRoot: 'src',
            entryFileNames: 'cjs/[name].js',
            chunkFileNames: 'cjs/[name].js',
          },
        ],
        external: [/node_modules/],
        plugins: [K(fe), se()],
      };
    },
    getVisualizerConfig: function (e, s, t) {
      const o = `${e}/${s}/${t}/visualizers/${new Date().toISOString().replace(/:/g, '-')}`;
      return {
        plugins: [
          oe({ filename: `${o}/flamegraph.html`, template: 'flamegraph' }),
          oe({ filename: `${o}/list.html`, template: 'list' }),
          oe({ filename: `${o}/network.html`, template: 'network' }),
          oe({ filename: `${o}/raw-data.html`, template: 'raw-data' }),
          oe({ filename: `${o}/sunburst.html`, template: 'sunburst' }),
          oe({ filename: `${o}/treemap.html`, template: 'treemap' }),
        ],
      };
    },
  })),
  ($ = Object.freeze({
    __proto__: null,
    getBuildStatsConfig: w,
    getBundleAnalyzerConfig: j,
    getCommonConfig: function (e, s, t, o, n) {
      const i = t === ge.BETA,
        r = t === ge.PROD,
        { entryPath: a, outputPath: c } = l(e);
      return {
        entry: a,
        output: {
          uniqueName: s.name,
          publicPath: '/',
          path: c,
          filename: `${s.version}/js/[name].[chunkhash:8].js`,
          chunkFilename: `${s.version}/js/[name].[chunkhash:8].js`,
          assetModuleFilename: `${s.version}/assets/[name].[contenthash:8][ext]`,
          crossOriginLoading: 'anonymous',
        },
        cache: {
          type: 'filesystem',
          version: `${s.version}_${t}`,
          store: 'pack',
          buildDependencies: { config: [n] },
        },
        devtool: !r && !i && 'source-map',
        module: {
          rules: [
            {
              test: /\.m?jsx?$/,
              exclude: /node_modules/,
              resolve: { fullySpecified: !1 },
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    plugins:
                      r || i
                        ? [
                            [
                              'transform-react-remove-prop-types',
                              { removeImport: !0 },
                            ],
                          ]
                        : [],
                  },
                },
              ],
            },
            { test: /\.(png|jpe?g|gif)$/i, type: 'asset/resource' },
            {
              test: /\.svg$/,
              use: [{ loader: '@svgr/webpack', options: fe }, 'url-loader'],
            },
            {
              test: /\.(scss|sass)$/,
              exclude: /node_modules/,
              use: [
                me.loader,
                {
                  loader: 'css-loader',
                  options: {
                    esModule: !1,
                    modules: {
                      mode: 'local',
                      localIdentName:
                        r || i
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
                me.loader,
                {
                  loader: 'css-loader',
                  options: {
                    esModule: !1,
                    modules: {
                      mode: 'local',
                      localIdentName:
                        r || i
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
          hints: r || i ? 'error' : 'warning',
          maxAssetSize: 25e4,
          maxEntrypointSize: 1e7,
        },
        optimization: {
          minimize: r || i,
          minimizer:
            r || i
              ? [
                  new re({
                    terserOptions: {
                      compress: {
                        inline: !1,
                        drop_console: !!r,
                        dead_code: !0,
                        drop_debugger: !!r,
                        conditionals: !0,
                        evaluate: !0,
                        booleans: !0,
                        loops: !0,
                        unused: !0,
                        hoist_funs: !0,
                        keep_fargs: !1,
                        hoist_vars: !0,
                        if_return: !0,
                        join_vars: !0,
                        side_effects: !0,
                      },
                      mangle: !0,
                      output: { comments: !1 },
                    },
                  }),
                  new ae({
                    minimizerOptions: {
                      preset: [
                        'default',
                        { discardComments: { removeAll: !0 } },
                      ],
                    },
                  }),
                ]
              : [],
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
            maxSize: 204800,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(e) {
                  const s = e.context.match(
                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                  )?.[1];
                  return s ? `vendor${s}` : 'vendor';
                },
                chunks: 'all',
                priority: -10,
                reuseExistingChunk: !0,
                enforce: !0,
                maxInitialRequests: 30,
                maxAsyncRequests: 30,
              },
            },
          },
          usedExports: !0,
          sideEffects: !0,
        },
        plugins: [
          new U.DefinePlugin({ [o]: JSON.stringify(t) }),
          new ce({ path: `./.env.${t}` }),
          new pe({
            template: 'public/index.html',
            filename: 'index.html',
            favicon: 'public/favicon.ico',
          }),
          new me({
            filename: `${s.version}/css/[name].[chunkhash:8].css`,
            chunkFilename: `${s.version}/css/[name].[chunkhash:8].css`,
            ignoreOrder: !0,
          }),
          new ue({ patterns: [{ from: 'public/netlify' }] }),
        ],
        resolve: { extensions: ['.mjs', '.js', '.jsx'] },
      };
    },
    getDevConfig: function (e, s) {
      const { outputPath: t } = l(e);
      return {
        name: 'client',
        target: 'web',
        mode: ge.DEV,
        devServer: {
          port: s || 3e3,
          static: { directory: t },
          historyApiFallback: !0,
          webSocketServer: !1,
          hot: !0,
        },
      };
    },
    getFederationConfig: function (e, s, t, o) {
      const n = f(s, o);
      return (
        Object.keys(n).forEach(e => {
          n[e];
        }),
        {}
      );
    },
    getMinimizerConfig: v,
    getProdConfig: function (e, s, t) {
      const { outputPath: o } = l(e),
        n = s === ge.BETA,
        i = s === ge.PROD;
      return {
        name: 'client',
        target: 'web',
        mode: ge.PROD,
        plugins: [
          new ne({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css)$/,
          }),
          new de({
            output: `${o}/asset-manifest.json`,
            publicPath: !0,
            writeToDisk: !0,
            customize: e => !e.key.toLowerCase().endsWith('.map') && e,
            done: (e, s) => {
              const t = `${o}/chunk-manifest.json`;
              try {
                const o = s.compilation.chunkGroups.reduce(
                  (s, t) => (
                    (s[t.name] = [
                      ...(s[t.name] || []),
                      ...t.chunks.reduce(
                        (s, t) => [
                          ...s,
                          ...[...t.files]
                            .filter(e => !e.endsWith('.map'))
                            .map(s => e.getPublicPath(s)),
                        ],
                        [],
                      ),
                    ]),
                    s
                  ),
                  Object.create(null),
                );
                O.writeFileSync(t, JSON.stringify(o, null, 2));
              } catch (e) {
                console.error(`ERROR: Cannot write ${t}: `, e),
                  i && process.exit(1);
              }
            },
          }),
          (n || i) && new ve({ variables: t }),
        ],
      };
    },
    getWorkersConfig: function (e) {
      const { outputPath: s } = l(e);
      return {
        plugins: [
          new le({
            swDest: `${s}/sw.js`,
            swSrc: './public/sw.js',
            exclude: [/asset-manifest\.json$/, /\.gz$/, /src\/assets\//],
            chunks: [],
          }),
        ],
      };
    },
  }));
const Pe = u();
k = Object.freeze({
  __proto__: null,
  getWebpackConfig: function (e, s, t, o, n, i, r) {
    return {
      stories: [`${e}/src/**/*.stories.@(js|jsx|ts|tsx)`, `${e}/src/**/*.mdx`],
      addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-links',
        '@storybook/addon-a11y',
        '@storybook/addon-interactions',
        '@storybook/addon-storysource',
        'storybook-addon-render-modes',
      ],
      framework: '@storybook/react-webpack5',
      webpackFinal: a => {
        if (!o) throw new Error(r);
        const l = { ...a },
          c = o === ge.PROD,
          u = o === ge.BETA;
        l.module.rules.push({
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        });
        (l.module.rules.find(
          e => !Array.isArray(e.test) && e.test.test('.svg'),
        ).exclude = /\.svg$/),
          l.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: fe }, 'url-loader'],
          }),
          l.module.rules.push({
            test: /\.(scss|sass)$/,
            exclude: /node_modules/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: !1,
                  modules: {
                    mode: 'local',
                    localIdentName:
                      c || u
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
                      `${e}/postcss.config.js` ??
                      `${e}/postcss.config.mjs` ??
                      x.resolve(Pe, '../postcssConfig.js'),
                    ctx: { env: c || u ? ge.PROD : ge.STG },
                  },
                },
              },
              'sass-loader',
            ],
          }),
          (l.optimization = {
            ...l.optimization,
            minimize: c || u,
            minimizer: c || u ? v(o).optimization.minimizer : [],
            splitChunks: { chunks: 'all', maxSize: 204800 },
          }),
          l.plugins.push(
            new ne({
              filename: '[path][base].br',
              algorithm: 'brotliCompress',
              test: /\.(js|css)$/,
            }),
          );
        const p = 'true' === i;
        return (
          'true' === n && l.plugins.push(j(s, 'storybook', o).plugins[0]),
          p && l.plugins.push(w(t, 'storybook', o).plugins[0]),
          l
        );
      },
    };
  },
});
export {
  P as MAIN_ENUMS,
  n as debugLog,
  t as errorLog,
  c as generateFileName,
  u as getDirname,
  l as getPaths,
  e as getPostcssConfig,
  f as getProjEntries,
  a as infoLog,
  s as log,
  p as minimizeContent,
  m as processPath,
  _ as rollupConfigs,
  S as rollupPlugins,
  k as storybookConfigs,
  fe as svgrConfig,
  r as tableLog,
  be as timeEndLog,
  he as timeLog,
  i as traceLog,
  o as warnLog,
  $ as webpackConfigs,
  z as webpackPlugins,
};
