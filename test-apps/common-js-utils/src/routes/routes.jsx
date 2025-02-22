/**
 * Routes file.
 * @file This file is saved as `routes/routes.jsx`.
 */
import { lazy } from 'react';

import ComponentWithSuspense from '../components/atoms/ComponentWithSuspense';
import HtmlContent from '../components/atoms/HtmlContent';

import { ROUTES, SEO } from '../enums/routes';

const Home = lazy(() => import(/* webpackChunkName: 'Home' */ '../pages/Home'));
const Abc = lazy(() => import(/* webpackChunkName: 'Abc' */ '../pages/Abc'));
const NotFound = lazy(
  () => import(/* webpackChunkName: 'NotFound' */ '../pages/NotFound'),
);

const routes = [
  {
    index: true,
    element: (
      <>
        <HtmlContent title={SEO.HOME.TITLE} description={SEO.HOME.DESC} />
        <ComponentWithSuspense component={<Home />} />
      </>
    ),
  },
  {
    path: ROUTES.ABC,
    element: (
      <>
        <HtmlContent title={SEO.ABC.TITLE} description={SEO.ABC.DESC} />
        <ComponentWithSuspense component={<Abc />} />
      </>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <>
        <HtmlContent
          title={SEO.NOT_FOUND.TITLE}
          description={SEO.NOT_FOUND.DESC}
        />
        <ComponentWithSuspense component={<NotFound />} />
      </>
    ),
  },
];

export default routes;
