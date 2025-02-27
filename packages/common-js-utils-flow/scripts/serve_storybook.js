/* eslint-disable no-console */
/**
 * This script serves the storybook.
 * @file This script is saved as `serve_storybook.js`.
 */
import express from 'express';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirName = path.dirname(filename);

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static('storybook-static'));

app.get('*', (req, res) => {
  res.sendFile(path.join(dirName, '../storybook-static/index.html'));
});

app.listen(port, err => {
  if (err) console.error(err);
  else console.log(chalk.green(`Server started at ${port} successfully !!!`));
});
