/**
 * Unit tests for StripCustomWindowVariablesPlugin Rollup plugin.
 * @file This file is saved as `StripCustomWindowVariablesPlugin.test.js`.
 */

import { createFilter } from '@rollup/pluginutils';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

import StripCustomWindowVariablesPlugin from '../StripCustomWindowVariablesPlugin.js';

// Mock dependencies
jest.mock('@rollup/pluginutils', () => ({
  createFilter: jest.fn(),
}));

jest.mock('@babel/parser', () => ({
  parse: jest.fn(),
}));

jest.mock('@babel/traverse', () => ({
  default: jest.fn(),
}));

jest.mock('@babel/generator', () => ({
  default: jest.fn(),
}));

describe('StripCustomWindowVariablesPlugin plugin', () => {
  let plugin;
  let mockFilter;
  let mockVisitors;

  beforeAll(() => {
    // Suppress console output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockVisitors = {};
    mockFilter = jest.fn(() => true);

    // Setup default mock implementations
    createFilter.mockImplementation(() => mockFilter);
    parse.mockImplementation(() => ({ type: 'Program', body: [] }));
    _traverse.default.mockImplementation((ast, visitors) => {
      mockVisitors = visitors;
    });
    _generate.default.mockImplementation(() => ({
      code: 'transformed code',
      map: 'source map',
    }));

    // Initialize plugin with test variables
    plugin = StripCustomWindowVariablesPlugin({
      variables: ['TEST_VAR'],
    });
  });

  it('should create plugin with correct name', () => {
    expect(plugin.name).toBe('strip-custom-window-variables-plugin');
  });

  it('should use default include/exclude patterns', () => {
    StripCustomWindowVariablesPlugin({});
    expect(createFilter).toHaveBeenCalledWith(
      ['**/*.{cjs,mjs,js,jsx,ts,tsx}'],
      [],
    );
  });

  describe('transform', () => {
    it('should skip transformation when file does not match filter', () => {
      mockFilter.mockReturnValue(false);
      const result = plugin.transform('code', 'file.js');
      expect(result).toBeNull();
      expect(mockFilter).toHaveBeenCalledWith('file.js');
    });

    it('should transform matching files', () => {
      mockFilter.mockReturnValue(true);
      const result = plugin.transform('code', 'file.js');
      expect(result).toEqual({
        code: 'transformed code',
        map: 'source map',
      });
      expect(mockFilter).toHaveBeenCalledWith('file.js');
    });

    it('should parse code with correct options', () => {
      plugin.transform('code', 'file.js');

      expect(parse).toHaveBeenCalledWith('code', {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });
    });

    describe('AST visitors', () => {
      beforeEach(() => {
        plugin.transform('window.TEST_VAR = "test";', 'file.js');
      });

      it('should remove specified window variables in MemberExpression', () => {
        const mockPath = {
          node: {
            object: { name: 'window' },
            property: { name: 'TEST_VAR' },
          },
          remove: jest.fn(),
        };

        mockVisitors.MemberExpression(mockPath);
        expect(mockPath.remove).toHaveBeenCalled();
      });

      it('should remove specified window variables in AssignmentExpression', () => {
        const mockPath = {
          node: {
            left: {
              object: { name: 'window' },
              property: { name: 'TEST_VAR' },
            },
          },
          remove: jest.fn(),
        };

        mockVisitors.AssignmentExpression(mockPath);
        expect(mockPath.remove).toHaveBeenCalled();
      });

      it('should ignore non-window variables', () => {
        const mockPath = {
          node: {
            object: { name: 'document' },
            property: { name: 'TEST_VAR' },
          },
          remove: jest.fn(),
        };

        mockVisitors.MemberExpression(mockPath);
        expect(mockPath.remove).not.toHaveBeenCalled();
      });

      it('should ignore non-specified window variables', () => {
        const mockPath = {
          node: {
            object: { name: 'window' },
            property: { name: 'OTHER_VAR' },
          },
          remove: jest.fn(),
        };

        mockVisitors.MemberExpression(mockPath);
        expect(mockPath.remove).not.toHaveBeenCalled();
      });

      it('should handle missing property names', () => {
        const mockPath = {
          node: {
            object: { name: 'window' },
            property: {},
          },
          remove: jest.fn(),
        };

        mockVisitors.MemberExpression(mockPath);
        expect(mockPath.remove).not.toHaveBeenCalled();
      });

      it('should handle incomplete node structure in AssignmentExpression', () => {
        const mockPath = {
          node: {
            left: {
              property: { name: 'TEST_VAR' },
            },
          },
          remove: jest.fn(),
        };

        mockVisitors.AssignmentExpression(mockPath);
        expect(mockPath.remove).not.toHaveBeenCalled();
      });

      it('should handle computed properties', () => {
        const mockPath = {
          node: {
            object: { name: 'window' },
            property: { value: 'TEST_VAR' },
            computed: true,
          },
          remove: jest.fn(),
        };

        mockVisitors.MemberExpression(mockPath);
        expect(mockPath.remove).not.toHaveBeenCalled();
      });
    });
  });
});
