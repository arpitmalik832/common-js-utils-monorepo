// @flow
import React, { Suspense } from 'react';

import Loader from '../../organisms/Loader';

type ComponentWithSuspenseProps = {
  component: React.Node,
  fallback?: React.Node,
};

function ComponentWithSuspense({
  component,
  fallback = <Loader />,
}: ComponentWithSuspenseProps): React.Node {
  return <Suspense fallback={fallback}>{component}</Suspense>;
}

export default ComponentWithSuspense;
