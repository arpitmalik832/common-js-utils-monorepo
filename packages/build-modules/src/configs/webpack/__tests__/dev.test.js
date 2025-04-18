/**
 * @file Test file for webpack dev configuration.
 */

import '@testing-library/jest-dom';

import getConfig from '../dev.js';
import { MAIN_ENUMS } from '../../../enums/index.js';

// Mock the dependencies
jest.mock('../../../utils', () => ({
  getPaths: jest.fn().mockReturnValue({
    outputPath: '/mock/output/path',
  }),
}));

describe('getConfig', () => {
  const mockProjectRoot = '/mock/project/root';
  const mockPort = 8080;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid webpack development configuration object', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config).toBeDefined();
    expect(config.name).toBe('client');
    expect(config.target).toBe('web');
    expect(config.mode).toBe(MAIN_ENUMS.ENVS.DEV);
    expect(config.devServer).toBeDefined();
  });

  it('should configure devServer with the provided port', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config.devServer.port).toBe(mockPort);
  });

  it('should use default port 3000 when no port is provided', () => {
    const config = getConfig(mockProjectRoot);

    expect(config.devServer.port).toBe(3000);
  });

  it('should configure static directory correctly', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config.devServer.static.directory).toBe('/mock/output/path');
  });

  it('should enable historyApiFallback', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config.devServer.historyApiFallback).toBe(true);
  });

  it('should disable webSocketServer', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config.devServer.webSocketServer).toBe(false);
  });

  it('should enable hot reloading', () => {
    const config = getConfig(mockProjectRoot, mockPort);

    expect(config.devServer.hot).toBe(true);
  });
});
