// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';
import Example0 from './Example0';

const NodeGroupDocs = (props) => {
  const { route: { docContext, srcContext } } = props;

  return (
    <div>
      <MarkdownElement text={docContext('./NodeGroup/README0.md')} />
      <PropTypeDescription code={srcContext('./NodeGroup/NodeGroup')} />
      <MarkdownElement text={docContext('./NodeGroup/README1.md')} />
      <CodeExample
        code={docContext('./NodeGroup/Example0')}
        title="Example 0: Donut Chart"
      >
        <Example0 />
      </CodeExample>
      <MarkdownElement text={docContext('./NodeGroup/README2.md')} />
      <MarkdownElement text={docContext('./NodeGroup/README3.md')} />
      <MarkdownElement text={docContext('./NodeGroup/README4.md')} />
    </div>
  );
};

NodeGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default NodeGroupDocs;
