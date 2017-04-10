// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import Example1 from './Example1';
import Example2 from './Example2';

const SurfaceDocs = (props) => {
  const { route: { docContext, srcContext } } = props;

  return (
    <div>
      <Title render={(previousTitle) => `Surface - ${previousTitle}`} />
      <MarkdownElement text={docContext('./Surface/README.md')} />
      <CodeExample
        code={docContext('./Surface/Example1')}
        title="Example 1"
      >
        <Example1 />
      </CodeExample>
      <CodeExample
        code={docContext('./Surface/Example2')}
        title="Example 2"
      >
        <Example2 />
      </CodeExample>
      <PropTypeDescription code={srcContext('./Surface/Surface')} />
    </div>
  );
};

SurfaceDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default SurfaceDocs;
