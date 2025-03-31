/**
 * Unit tests for ImportStylesPlugin Rollup plugin.
 * @file This file is saved as `ImportStylesPlugin.test.js`.
 */

import ImportStylesPlugin from '../ImportStylesPlugin.js';
import { MAIN_ENUMS } from '../../../enums/index.js';

describe('ImportStylesPlugin plugin', () => {
  let plugin;
  const mockBundle = {
    'esm/lib.js': {
      code: 'export const test = "test";',
    },
    'cjs/lib.js': {
      code: 'exports.test = "test";',
    },
    'other.js': {
      code: 'console.log("test");',
    },
  };

  beforeEach(() => {
    plugin = ImportStylesPlugin(MAIN_ENUMS.ENVS.DEV);
  });

  it('should create plugin with correct name', () => {
    expect(plugin.name).toBe('import-styles-plugin');
  });

  describe('generateBundle', () => {
    it('should add ESM style import in development', () => {
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['esm/lib.js'].code).toBe(
        'import "../index.css";\nexport const test = "test";',
      );
    });

    it('should add CJS style import in development', () => {
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['cjs/lib.js'].code).toBe(
        'require("../index.css");\nexports.test = "test";',
      );
    });

    it('should add ESM style import without newline in production', () => {
      plugin = ImportStylesPlugin(MAIN_ENUMS.ENVS.PROD);
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['esm/lib.js'].code).toBe(
        'import "../index.css";export const test = "test";',
      );
    });

    it('should add CJS style import without newline in beta', () => {
      plugin = ImportStylesPlugin(MAIN_ENUMS.ENVS.BETA);
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['cjs/lib.js'].code).toBe(
        'require("../index.css");exports.test = "test";',
      );
    });

    it('should not modify other files', () => {
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      const originalCode = bundle['other.js'].code;
      plugin.generateBundle({}, bundle);

      expect(bundle['other.js'].code).toBe(originalCode);
    });

    it('should handle missing target files', () => {
      const bundle = {
        'other.js': {
          code: 'console.log("test");',
        },
      };

      expect(() => {
        plugin.generateBundle({}, bundle);
      }).not.toThrow();
    });

    it('should handle empty bundle', () => {
      expect(() => {
        plugin.generateBundle({}, {});
      }).not.toThrow();
    });

    it('should add newline in staging environment', () => {
      plugin = ImportStylesPlugin(MAIN_ENUMS.ENVS.STAGING);
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['esm/lib.js'].code).toBe(
        'import "../index.css";\nexport const test = "test";',
      );
      expect(bundle['cjs/lib.js'].code).toBe(
        'require("../index.css");\nexports.test = "test";',
      );
    });

    it('should handle null environment', () => {
      plugin = ImportStylesPlugin(null);
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['esm/lib.js'].code).toBe(
        'import "../index.css";\nexport const test = "test";',
      );
      expect(bundle['cjs/lib.js'].code).toBe(
        'require("../index.css");\nexports.test = "test";',
      );
    });

    it('should handle undefined environment', () => {
      plugin = ImportStylesPlugin();
      const bundle = JSON.parse(JSON.stringify(mockBundle));
      plugin.generateBundle({}, bundle);

      expect(bundle['esm/lib.js'].code).toBe(
        'import "../index.css";\nexport const test = "test";',
      );
      expect(bundle['cjs/lib.js'].code).toBe(
        'require("../index.css");\nexports.test = "test";',
      );
    });
  });
});
