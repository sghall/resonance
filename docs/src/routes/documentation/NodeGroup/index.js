// @flow weak

import React, { PropTypes } from 'react';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import Example1 from './Example1';
import Example2 from './Example2';

const NodeGroupDocs = (props) => {
  const { route: { docContext, srcContext } } = props;

  return (
    <div>
      <Title render={(previousTitle) => `NodeGroup - ${previousTitle}`} />
      <MarkdownElement text={docContext('./NodeGroup/README.md')} />
      <CodeExample
        code={docContext('./NodeGroup/Example1')}
        title="Example 1: Basic Bars"
      >
        <Example1 />
      </CodeExample>
      <CodeExample
        code={docContext('./NodeGroup/Example2')}
        title="Example 2: Circles w/ D3 Ease Function"
      >
        <Example2 />
      </CodeExample>
      <PropTypeDescription code={srcContext('./NodeGroup/NodeGroup')} />
    </div>
  );
};

NodeGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default NodeGroupDocs;
