// @flow
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type HtmlContentProps = {
  title: string,
  description: string,
};

function HtmlContent({ title, description }: HtmlContentProps): React.Node {
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
