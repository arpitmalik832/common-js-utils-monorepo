/**
 * This script is used to serve the production build of the application.
 * @file The file is saved as `scripts/server.js`.
 */
import express from 'express';
import expressStaticGzip from 'express-static-gzip';

import { outputPath } from '../build_utils/config/commonPaths.mjs';
import { SERVER_STARTED_SUCCESSFULLY } from '../build_utils/config/logs.mjs';

const app = express();
const port = 8080;

// TODO: Move to Utils
// function serveWithNoCacheHeaders(file, res) {
//   const filePath = path.join(__dirname, file);
//   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   res.header('Expires', '-1');
//   res.header('Pragma', 'no-cache');
//   res.sendFile(filePath);
// }

app.set('ETag', 'strong');

app.use(
  '/',
  expressStaticGzip(outputPath, {
    urlContains: 'static/',
    setHeaders: res => res.setHeader('Cache-Control', 'private, max-age=60'),
  }),
);

// app.get('/workers/sharedWorker.js', (_, res) => {
//   serveWithNoCacheHeaders(
//     path.join(__dirname, 'build', 'workers/sharedWorker.js'),
//     res,
//   );
// });

app.get('/*', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(`${outputPath}/index.html`);
});

app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(SERVER_STARTED_SUCCESSFULLY(port));
});
