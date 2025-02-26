// @flow
import React from 'react';
import { RouterProvider } from 'react-router';

import router from '../routes';
import useAppMount from '../hooks/useAppMount';
import '@arpitmalik832/common-js-utils-flow/styles/postcss-processed/index.css';

function App(): React.Node {
  useAppMount();

  return <RouterProvider router={router} />;
}

export default App;
