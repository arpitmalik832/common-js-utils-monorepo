/**
 * @file Unit tests for base ESLint configuration.
 */
import getBaseConfig from '../base.js';
import { FILES_ENUMS } from '../../enums/index.js';

// Mock the required dependencies
jest.mock('@eslint/js', () => ({
  configs: {
    recommended: {
      rules: {
        'mocked-rule': 'error',
      },
    },
  },
}));

jest.mock('@eslint/eslintrc', () => ({
  FlatCompat: jest.fn().mockImplementation(() => ({
    config: jest.fn().mockReturnValue([
      {
        rules: {
          'prettier/prettier': [
            1,
            {
              endOfLine: 'lf',
            },
          ],
        },
      },
    ]),
  })),
}));

jest.mock('eslint-plugin-import', () => ({
  flatConfigs: {
    recommended: {
      rules: {
        'import/mocked-rule': 'error',
      },
    },
  },
}));

jest.mock('../../utils/index.js', () => ({
  getDirname: jest.fn().mockReturnValue('/mocked/path'),
}));

describe('Base ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    jest.clearAllMocks();
    const [, mainConfig] = getBaseConfig();
    config = mainConfig;
  });

  describe('getConfig function', () => {
    test('should return an array of configurations', () => {
      const configs = getBaseConfig();
      expect(Array.isArray(configs)).toBe(true);
      expect(configs).toHaveLength(2);
    });

    test('should include FlatCompat config', () => {
      const configs = getBaseConfig();
      expect(configs[0].rules['prettier/prettier']).toEqual([
        1,
        {
          endOfLine: 'lf',
        },
      ]);
    });

    test('should target JavaScript files', () => {
      expect(config.files).toEqual([FILES_ENUMS.JS_FILES]);
    });

    test('should include import plugin', () => {
      expect(config.plugins).toHaveProperty('import');
    });

    test('should have correct import rules', () => {
      expect(config.rules['import/no-extraneous-dependencies']).toEqual([
        2,
        {
          packageDir: '.',
        },
      ]);
      expect(config.rules['import/prefer-default-export']).toBe(0);
      expect(config.rules['import/extensions']).toBe(0);
      expect(config.rules['import/no-unresolved']).toEqual([
        2,
        {
          ignore: [],
        },
      ]);
    });

    test('should have correct general rules', () => {
      expect(config.rules['no-console']).toBe(2);
      expect(config.rules['no-debugger']).toBe(2);
      expect(config.rules['no-unused-vars']).toBe(2);
      expect(config.rules['prefer-destructuring']).toBe(2);
      expect(config.rules['func-names']).toBe(2);
      expect(config.rules.camelcase).toBe(1);
    });

    test('should have correct import resolver settings', () => {
      expect(config.settings['import/resolver']).toEqual({
        node: {
          extensions: ['.js', '.jsx'],
        },
      });
    });

    test('should pass noUnresolvedIgnoreArr to import/no-unresolved rule', () => {
      const noUnresolvedIgnoreArr = ['package1', 'package2'];
      const [, testConfig] = getBaseConfig(noUnresolvedIgnoreArr);
      expect(testConfig.rules['import/no-unresolved']).toEqual([
        2,
        {
          ignore: noUnresolvedIgnoreArr,
        },
      ]);
    });
  });
});
