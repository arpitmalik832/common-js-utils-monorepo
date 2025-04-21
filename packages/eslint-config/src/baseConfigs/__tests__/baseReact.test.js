/**
 * @file Unit tests for base React ESLint configuration.
 */
import getBaseReactConfig from '../baseReact.js';
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
          'css-modules/no-unused-class': [
            2,
            {
              camelCase: true,
            },
          ],
          'css-modules/no-undef-class': [
            2,
            {
              camelCase: true,
            },
          ],
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

jest.mock('eslint-plugin-jsx-a11y', () => ({
  flatConfigs: {
    strict: {
      rules: {
        'jsx-a11y/mocked-rule': 'error',
      },
    },
  },
}));

jest.mock('eslint-plugin-react', () => ({
  configs: {
    flat: {
      all: {
        rules: {
          'react/mocked-rule': 'error',
        },
      },
      'jsx-runtime': {
        rules: {
          'react/jsx-runtime': 'error',
        },
      },
    },
  },
}));

jest.mock('eslint-plugin-react-hooks', () => ({
  configs: {
    recommended: {
      rules: {
        'react-hooks/mocked-rule': 'error',
      },
    },
  },
}));

jest.mock('../../utils/index.js', () => ({
  getDirname: jest.fn().mockReturnValue('/mocked/path'),
}));

describe('Base React ESLint Configuration', () => {
  let config;

  beforeEach(() => {
    jest.clearAllMocks();
    const [, mainConfig] = getBaseReactConfig();
    config = mainConfig; // The second config is the main one
  });

  describe('getConfig function', () => {
    test('should return an array of configurations', () => {
      const configs = getBaseReactConfig();
      expect(Array.isArray(configs)).toBe(true);
      expect(configs).toHaveLength(2);
    });

    test('should include FlatCompat config', () => {
      const configs = getBaseReactConfig();
      expect(configs[0].rules['css-modules/no-unused-class']).toEqual([
        2,
        {
          camelCase: true,
        },
      ]);
      expect(configs[0].rules['css-modules/no-undef-class']).toEqual([
        2,
        {
          camelCase: true,
        },
      ]);
      expect(configs[0].rules['prettier/prettier']).toEqual([
        1,
        {
          endOfLine: 'lf',
        },
      ]);
    });

    test('should target JavaScript and Markdown files', () => {
      expect(config.files).toEqual([
        FILES_ENUMS.JS_FILES,
        FILES_ENUMS.MD_FILES,
      ]);
    });

    test('should include all required plugins', () => {
      expect(config.plugins).toHaveProperty('import');
      expect(config.plugins).toHaveProperty('jsx-a11y');
      expect(config.plugins).toHaveProperty('react');
      expect(config.plugins).toHaveProperty('react-hooks');
    });

    test('should have correct React rules', () => {
      expect(config.rules['react/react-in-jsx-scope']).toBe(0);
      expect(config.rules['react/function-component-definition']).toBe(0);
      expect(config.rules['react/prop-types']).toBe(0);
      expect(config.rules['react/jsx-filename-extension']).toEqual([
        0,
        {
          extensions: ['.tsx'],
        },
      ]);
      expect(config.rules['react/require-default-props']).toBe(0);
    });

    test('should have correct React Hooks rules', () => {
      expect(config.rules['react-hooks/rules-of-hooks']).toBe(2);
      expect(config.rules['react-hooks/exhaustive-deps']).toBe(0);
    });

    test('should have correct import rules', () => {
      expect(config.rules['import/no-extraneous-dependencies']).toEqual([
        2,
        {
          packageDir: '.',
        },
      ]);
      expect(config.rules['import/prefer-default-export']).toBe(0);
      expect(config.rules['import/extensions']).toEqual([
        2,
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ]);
      expect(config.rules['import/no-unresolved']).toEqual([
        2,
        {
          ignore: [],
        },
      ]);
    });

    test('should have correct accessibility rules', () => {
      expect(config.rules['jsx-a11y/anchor-is-valid']).toBe(2);
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
      const configs = getBaseReactConfig(noUnresolvedIgnoreArr);
      const reactConfig = configs[1];
      expect(reactConfig.rules['import/no-unresolved']).toEqual([
        2,
        {
          ignore: noUnresolvedIgnoreArr,
        },
      ]);
    });
  });
});
