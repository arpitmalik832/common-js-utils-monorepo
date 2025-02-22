/**
 * The ComponentWithSuspense component wraps a given component in a Suspense boundary.
 * @file The file is saved as `ComponentWithSuspense.jsx`.
 */
import { Suspense } from 'react';

import Loader from '../../organisms/Loader';

/**
 * A component that wraps a given component in a Suspense boundary.
 * @param {object} props - The component props.
 * @param {import('react').ReactNode} props.component - The component to render.
 * @param {import('react').ReactNode} props.fallback - The fallback UI to display while loading.
 * @returns {import('react').JSX.Element} The wrapped component.
 * @example
 * <ComponentWithSuspense component={<MyComponent />} />
 */
function ComponentWithSuspense({ component, fallback = <Loader /> }) {
  return <Suspense fallback={fallback}>{component}</Suspense>;
}

export default ComponentWithSuspense;
