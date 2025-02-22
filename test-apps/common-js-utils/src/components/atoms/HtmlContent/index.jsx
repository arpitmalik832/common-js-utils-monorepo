/**
 * HtmlContent component for rendering page title and description.
 * @file The file is saved as`HtmlContent/index.jsx`.
 */
import { Helmet, HelmetProvider } from 'react-helmet-async';

/**
 * HtmlContent component to render the page title and description.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the page.
 * @param {string} props.description - The description of the page.
 * @returns {import('react').JSX.Element} The rendered component.
 * @example
 * <HtmlContent title="My Title" description="My Description" />
 */
function HtmlContent({ title, description }) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`${description}`} />
      </Helmet>
    </HelmetProvider>
  );
}

export default HtmlContent;
