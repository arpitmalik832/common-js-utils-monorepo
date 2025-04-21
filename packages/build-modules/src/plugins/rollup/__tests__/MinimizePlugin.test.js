/**
 * Unit tests for MinimizePlugin.
 * @file This file is saved as `MinimizePlugin.test.js`.
 */
import '@testing-library/jest-dom';

import MinimizePlugin from '../MinimizePlugin.js';
import { processPath } from '../../../utils/index.js';
import { MAIN_ENUMS } from '../../../enums/index.js';

// Mock the processPath function
jest.mock('../../../utils/index.js', () => ({
  processPath: jest.fn().mockResolvedValue(undefined),
  errorLog: jest.fn(),
}));

describe('MinimizePlugin', () => {
  let plugin;
  const mockPaths = ['path1', 'path2', 'path3'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a plugin with the correct name', () => {
    plugin = MinimizePlugin(mockPaths, MAIN_ENUMS.ENVS.PROD);
    expect(plugin.name).toBe('minimize-plugin');
  });

  it('should not process paths in non-prod/beta environments', async () => {
    plugin = MinimizePlugin(mockPaths, MAIN_ENUMS.ENVS.DEV);
    await plugin.writeBundle();
    expect(processPath).not.toHaveBeenCalled();
  });

  it('should process all paths in production environment', async () => {
    plugin = MinimizePlugin(mockPaths, MAIN_ENUMS.ENVS.PROD);
    await plugin.writeBundle();
    expect(processPath).toHaveBeenCalledTimes(mockPaths.length);
    mockPaths.forEach(path => {
      expect(processPath).toHaveBeenCalledWith(path);
    });
  });

  it('should process all paths in beta environment', async () => {
    plugin = MinimizePlugin(mockPaths, MAIN_ENUMS.ENVS.BETA);
    await plugin.writeBundle();
    expect(processPath).toHaveBeenCalledTimes(mockPaths.length);
    mockPaths.forEach(path => {
      expect(processPath).toHaveBeenCalledWith(path);
    });
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Test error');
    processPath.mockRejectedValueOnce(mockError);

    plugin = MinimizePlugin(mockPaths, MAIN_ENUMS.ENVS.PROD);
    await plugin.writeBundle();

    // Should continue processing other paths even if one fails
    expect(processPath).toHaveBeenCalledTimes(mockPaths.length);
  });
});
