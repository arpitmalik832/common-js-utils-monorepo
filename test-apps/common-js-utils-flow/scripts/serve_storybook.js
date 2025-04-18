/**
 * This script is used to serve the storybook static files.
 * @file The file is saved as `scripts/serve_storybook.js`.
 */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

/**
 * Get the config directory.
 * @returns {string} The config directory.
 * @example
 * const dirname = getConfigDir();
 */
function getConfigDir() {
  if (typeof __dirname !== 'undefined') {
    // CommonJS environment
    return __dirname;
  }
  // ESM environment
  const filename = fileURLToPath(import.meta.url);
  return path.dirname(filename);
}

const dirname = getConfigDir();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static('storybook-static'));

app.get('*', (req, res) => {
  res.sendFile(path.join(dirname, '../storybook-static/index.html'));
});

app.listen(port, err => {
  if (err) console.error(err);
  else console.log(chalk.green(`Server started at ${port} successfully !!!`));
});
