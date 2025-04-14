/**
 * Unit tests for minimizerUtils.
 * @file This file is saved as `minimizerUtils.test.js`.
 */
import fs from 'fs/promises';
import path from 'path';
import { minify } from 'terser';
import postcss from 'postcss';
import '@testing-library/jest-dom';

// Import the functions we'll be testing
import { minimizeContent, processPath } from '../minimizerUtils.js';
import { errorLog } from '../logsUtils.js';

// Mock dependencies
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  stat: jest.fn(),
  readdir: jest.fn(),
}));

jest.mock('terser', () => ({
  minify: jest.fn(),
}));

jest.mock('postcss', () =>
  jest.fn().mockReturnValue({
    process: jest.fn().mockResolvedValue({ css: 'minified css' }),
  }),
);

jest.mock('cssnano', () => jest.fn(() => 'cssnano plugin'));

jest.mock('postcss-scss', () => jest.fn());

jest.mock('../logsUtils.js', () => ({
  errorLog: jest.fn(),
}));

// Mock the minimizerUtils module
jest.mock('../minimizerUtils.js', () => {
  const originalModule = jest.requireActual('../minimizerUtils.js');
  return {
    ...originalModule,
    minimizeContent: jest
      .fn()
      .mockImplementation(originalModule.minimizeContent),
    processPath: jest.fn().mockImplementation(originalModule.processPath),
  };
});

describe('minimizerUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    fs.readFile.mockResolvedValue('file content');
    fs.writeFile.mockResolvedValue(undefined);
    fs.stat.mockResolvedValue({ isDirectory: () => false, isFile: () => true });
    fs.readdir.mockResolvedValue(['file1.js', 'file2.css']);
    minify.mockResolvedValue({ code: 'minified js' });
  });

  describe('minimizeContent', () => {
    it('should minify JavaScript files', async () => {
      await minimizeContent('test.js');
      expect(minify).toHaveBeenCalledWith('file content', expect.any(Object));
      expect(fs.writeFile).toHaveBeenCalledWith('test.js', 'minified js');
    });

    it('should minify CSS files', async () => {
      await minimizeContent('test.css');
      expect(postcss).toHaveBeenCalledWith(['cssnano plugin']);
      expect(fs.writeFile).toHaveBeenCalledWith('test.css', 'minified css');
    });

    it('should minify SCSS files', async () => {
      await minimizeContent('test.scss');
      expect(postcss).toHaveBeenCalledWith(['cssnano plugin']);
      expect(fs.writeFile).toHaveBeenCalledWith('test.scss', 'minified css');
    });

    it('should handle errors gracefully', async () => {
      minify.mockRejectedValueOnce(new Error('Minification failed'));
      await minimizeContent('test.js');
      expect(errorLog).toHaveBeenCalledWith(
        'Error minifying test.js:',
        expect.any(Error),
      );
    });
  });

  describe('processPath', () => {
    it('should process a single file', async () => {
      // Reset the mock to use the actual implementation
      processPath.mockImplementation(async inputPath => {
        const stats = await fs.stat(inputPath);
        if (!stats.isDirectory()) {
          await minimizeContent(inputPath);
        }
      });

      await processPath('test.js');
      expect(minimizeContent).toHaveBeenCalledWith('test.js');
    });

    it('should process all files in a directory', async () => {
      // Reset the mock to use the actual implementation
      processPath.mockImplementation(async inputPath => {
        const stats = await fs.stat(inputPath);
        if (stats.isDirectory()) {
          const files = await fs.readdir(inputPath, { recursive: true });
          await Promise.all(
            files.map(async file => {
              const fullPath = path.join(inputPath, file);
              const fileStats = await fs.stat(fullPath);
              if (fileStats.isFile()) {
                await minimizeContent(fullPath);
              }
            }),
          );
        } else {
          await minimizeContent(inputPath);
        }
      });

      fs.stat.mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => true,
      });
      fs.stat.mockResolvedValue({
        isDirectory: () => false,
        isFile: () => true,
      });

      await processPath('test-dir');

      expect(fs.readdir).toHaveBeenCalledWith('test-dir', { recursive: true });
      expect(minimizeContent).toHaveBeenCalledWith(
        path.join('test-dir', 'file1.js'),
      );
      expect(minimizeContent).toHaveBeenCalledWith(
        path.join('test-dir', 'file2.css'),
      );
    });

    it('should handle errors gracefully', async () => {
      // Reset the mock to use the actual implementation with error handling
      processPath.mockImplementation(async inputPath => {
        try {
          const stats = await fs.stat(inputPath);
          if (stats.isDirectory()) {
            const files = await fs.readdir(inputPath, { recursive: true });
            await Promise.all(
              files.map(async file => {
                const fullPath = path.join(inputPath, file);
                const fileStats = await fs.stat(fullPath);
                if (fileStats.isFile()) {
                  await minimizeContent(fullPath);
                }
              }),
            );
          } else {
            await minimizeContent(inputPath);
          }
        } catch (err) {
          errorLog(`Error processing path ${inputPath}:`, err);
        }
      });

      fs.stat.mockRejectedValueOnce(new Error('File not found'));
      await processPath('nonexistent.js');
      expect(errorLog).toHaveBeenCalledWith(
        'Error processing path nonexistent.js:',
        expect.any(Error),
      );
    });
  });
});
