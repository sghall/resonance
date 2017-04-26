// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';

import Example1 from './Example1';
import Example2 from './Example2';
import Example3 from './Example3';

const NodeGroupDocs = (props) => {
  const { route: { docContext } } = props;

  return (
    <div>
      <Title render={(previousTitle) => `createNodeGroup - ${previousTitle}`} />
      <MarkdownElement text={docContext('./createNodeGroup/README1.md')} />
      <CodeExample
        code={docContext('./createNodeGroup/Example1')}
        title="Example 1: Simple Bars"
      >
        <Example1 />
      </CodeExample>
      <MarkdownElement text={docContext('./createNodeGroup/README2.md')} />
      <CodeExample
        code={docContext('./createNodeGroup/Example2')}
        title="Example 2: Passing Arrays of Transition Objects"
      >
        <Example2 />
      </CodeExample>
      <MarkdownElement text={docContext('./createNodeGroup/README3.md')} />
      <CodeExample
        code={docContext('./createNodeGroup/Example3')}
        title="Example 3: SVG Circles"
      >
        <Example3 />
      </CodeExample>
    </div>
  );
};

NodeGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default NodeGroupDocs;
