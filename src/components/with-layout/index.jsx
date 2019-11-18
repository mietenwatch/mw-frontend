import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import Menu from '../menu';
import Text from '../text/text';
import Footer from '../footer';
import SEO from '../SEO';

const components = {
  p: Text
};

export default ({ children, ...props }) => {
  const { path } = props;
  return (
    <>
      <SEO />
      <Menu path={path} />
      <MDXProvider components={components}>{children}</MDXProvider>
      <Footer />
    </>
  );
};
