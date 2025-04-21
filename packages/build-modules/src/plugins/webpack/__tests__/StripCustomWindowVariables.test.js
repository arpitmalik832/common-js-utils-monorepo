/**
 * @file Test file for StripCustomWindowVariables plugin.
 */

import StripCustomWindowVariablesPlugin from '../StripCustomWindowVariables.js';

describe('StripCustomWindowVariablesPlugin', () => {
  let plugin;
  let mockCompiler;
  let mockCompilation;
  let mockAssets;

  beforeEach(() => {
    // Reset mocks
    mockAssets = {
      'main.js': {
        source: () => 'window.CONSOLE_LOG = true; window.DEBUG = false;',
      },
      'styles.css': {
        source: () => '/* CSS content */',
      },
    };

    mockCompilation = {
      PROCESS_ASSETS_STAGE_ADDITIONAL: 1000,
      hooks: {
        processAssets: {
          tap: jest.fn(),
        },
      },
    };

    mockCompiler = {
      hooks: {
        compilation: {
          tap: jest.fn((name, callback) => {
            callback(mockCompilation);
          }),
        },
      },
    };
  });

  it('should initialize with empty variables array if none provided', () => {
    plugin = new StripCustomWindowVariablesPlugin({});
    expect(plugin.variables).toEqual([]);
  });

  it('should initialize with provided variables array', () => {
    const variables = ['CONSOLE_LOG', 'DEBUG'];
    plugin = new StripCustomWindowVariablesPlugin({ variables });
    expect(plugin.variables).toEqual(variables);
  });

  it('should apply the plugin correctly', () => {
    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['CONSOLE_LOG'],
    });
    plugin.apply(mockCompiler);

    // Verify compilation hook was tapped
    expect(mockCompiler.hooks.compilation.tap).toHaveBeenCalledWith(
      'StripCustomWindowVariablesPlugin',
      expect.any(Function),
    );

    // Get the processAssets callback
    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];

    // Call the callback with mock assets
    processAssetsCallback(mockAssets);

    // Verify the JavaScript file was processed
    expect(mockAssets['main.js'].source()).toBe(' window.DEBUG = false;');
    // Verify CSS file was not modified
    expect(mockAssets['styles.css'].source()).toBe('/* CSS content */');
  });

  it('should handle multiple variables to strip', () => {
    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['CONSOLE_LOG', 'DEBUG'],
    });
    plugin.apply(mockCompiler);

    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];
    processAssetsCallback(mockAssets);

    // Both variables should be stripped
    expect(mockAssets['main.js'].source()).toBe(' ');
  });

  it('should not modify non-JavaScript files', () => {
    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['CONSOLE_LOG'],
    });
    plugin.apply(mockCompiler);

    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];
    const originalCssContent = mockAssets['styles.css'].source();
    processAssetsCallback(mockAssets);

    expect(mockAssets['styles.css'].source()).toBe(originalCssContent);
  });

  it('should handle JavaScript files with no matching variables', () => {
    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['NONEXISTENT'],
    });
    plugin.apply(mockCompiler);

    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];
    const originalJsContent = mockAssets['main.js'].source();
    processAssetsCallback(mockAssets);

    expect(mockAssets['main.js'].source()).toBe(originalJsContent);
  });

  it('should handle JavaScript files with complex variable assignments', () => {
    mockAssets['main.js'] = {
      source: () =>
        'window.CONSOLE_LOG = { enabled: true, level: "debug" }; window.DEBUG = false;',
    };

    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['CONSOLE_LOG'],
    });
    plugin.apply(mockCompiler);

    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];
    processAssetsCallback(mockAssets);

    expect(mockAssets['main.js'].source()).toBe(' window.DEBUG = false;');
  });

  it('should handle multiple occurrences of the same variable', () => {
    mockAssets['main.js'] = {
      source: () => 'window.CONSOLE_LOG = true; window.CONSOLE_LOG = false;',
    };

    plugin = new StripCustomWindowVariablesPlugin({
      variables: ['CONSOLE_LOG'],
    });
    plugin.apply(mockCompiler);

    const processAssetsCallback =
      mockCompilation.hooks.processAssets.tap.mock.calls[0][1];
    processAssetsCallback(mockAssets);

    expect(mockAssets['main.js'].source()).toBe(' ');
  });
});
