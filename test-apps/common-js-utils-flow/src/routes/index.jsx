// @flow
import React, { lazy } from 'react';
import { createBrowserRouter, Router } from 'react-router';

import ComponentWithSuspense from '../components/atoms/ComponentWithSuspense';
import PageWrapper from '../HOC/PageWrapper';
import routes from './routes';

const Error = lazy(
  () => import(/* webpackChunkName: 'Error' */ '../pages/Error'),
);

const router: Router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    errorElement: <ComponentWithSuspense component={<Error />} />,
    children: [...routes],
  },
]);

export default router;
