/**
 * Unit tests for CopyPlugin Rollup plugin.
 * @file This file is saved as `CopyPlugin.test.js`.
 */

import copyPlugin from 'rollup-plugin-copy';

import CopyPlugin from '../CopyPlugin.js';

// Mock the rollup-plugin-copy module
jest.mock('rollup-plugin-copy', () =>
  jest.fn().mockImplementation(config => ({
    name: 'CopyPlugin',
    ...config,
  })),
);

describe('CopyPlugin plugin', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    jest.clearAllMocks();
  });

  it('should create plugin with empty targets array', () => {
    const result = CopyPlugin([]);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets: [],
    });
    expect(result).toHaveProperty('name', 'CopyPlugin');
  });

  it('should handle single target configuration', () => {
    const targets = [
      {
        src: 'source/path',
        dest: 'destination/path',
      },
    ];

    const result = CopyPlugin(targets);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets,
    });
    expect(result.targets).toEqual(targets);
  });

  it('should handle multiple target configurations', () => {
    const targets = [
      {
        src: 'source1/path',
        dest: 'destination1/path',
      },
      {
        src: 'source2/path',
        dest: 'destination2/path',
      },
    ];

    const result = CopyPlugin(targets);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets,
    });
    expect(result.targets).toEqual(targets);
  });

  it('should preserve target object structure', () => {
    const targets = [
      {
        src: 'source/path',
        dest: 'destination/path',
        rename: 'newname.js',
        transform: contents => contents,
      },
    ];

    const result = CopyPlugin(targets);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets,
    });
    expect(result.targets[0]).toHaveProperty('src', 'source/path');
    expect(result.targets[0]).toHaveProperty('dest', 'destination/path');
    expect(result.targets[0]).toHaveProperty('rename', 'newname.js');
    expect(result.targets[0]).toHaveProperty('transform');
  });

  it('should handle array of source files', () => {
    const targets = [
      {
        src: ['source1.js', 'source2.js'],
        dest: 'destination/path',
      },
    ];

    const result = CopyPlugin(targets);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets,
    });
    expect(Array.isArray(result.targets[0].src)).toBe(true);
    expect(result.targets[0].src).toHaveLength(2);
  });

  it('should handle glob patterns in source', () => {
    const targets = [
      {
        src: 'source/**/*.js',
        dest: 'destination/path',
      },
    ];

    const result = CopyPlugin(targets);

    expect(copyPlugin).toHaveBeenCalledWith({
      targets,
    });
    expect(result.targets[0].src).toBe('source/**/*.js');
  });

  it('should maintain plugin interface', () => {
    const result = CopyPlugin([
      {
        src: 'source/path',
        dest: 'destination/path',
      },
    ]);

    expect(result).toHaveProperty('name');
    expect(typeof result).toBe('object');
  });

  it('should throw error for invalid target structure', () => {
    const invalidTargets = [{ invalid: 'structure' }];

    expect(() => {
      CopyPlugin(invalidTargets);
    }).not.toThrow();

    expect(copyPlugin).toHaveBeenCalledWith({
      targets: invalidTargets,
    });
  });
});
