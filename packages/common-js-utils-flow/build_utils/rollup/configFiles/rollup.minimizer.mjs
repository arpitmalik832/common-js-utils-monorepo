/**
 * Rollup configuration for the main library build.
 * @file This file is saved as `main.mjs`.
 */
import terser from '@rollup/plugin-terser';

const config = {
  plugins: [
    terser({
      compress: {
        dead_code: true,
        drop_debugger: true,
        drop_console: false,
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
    }),
  ],
};

export default config;
