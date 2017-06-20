// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import Example0 from './Example0';
import Example1 from './Example1';
import Example2 from './Example2';
import Example3 from './Example3';
import Example4 from './Example4';

const NodeGroupDocs = (props) => {
  const { route: { docContext, srcContext } } = props;

  return (
    <div>
      <CodeExample
        code={docContext('./NodeGroup/Example3')}
        title="Example 3: Passing Arrays of Transition Objects"
      >
        <Example3 />
      </CodeExample>
      <CodeExample
        code={docContext('./NodeGroup/Example2')}
        title="Example 2: Bars w/ More Complex Timing"
      >
        <Example2 />
      </CodeExample>
      <CodeExample
        code={docContext('./NodeGroup/Example1')}
        title="Example 1: Simple Bars"
      >
        <Example1 />
      </CodeExample>
      <CodeExample
        code={docContext('./NodeGroup/Example0')}
        title="Example 0: Donut Chart"
      >
        <Example0 />
      </CodeExample>
    </div>
  );
};

// const NodeGroupDocs = (props) => {
//   const { route: { docContext, srcContext } } = props;

//   return (
//     <div>
//       <Title render={(previousTitle) => `NodeGroup - ${previousTitle}`} />
//       <MarkdownElement text={docContext('./NodeGroup/README0.md')} />
//       <PropTypeDescription code={srcContext('./NodeGroup/NodeGroup')} />
//       <MarkdownElement text={docContext('./NodeGroup/README1.md')} />
//       <CodeExample
//         code={docContext('./NodeGroup/Example0')}
//         title="Example 0: Donut Chart"
//       >
//         <Example0 />
//       </CodeExample>
//       <MarkdownElement text={docContext('./NodeGroup/README2.md')} />
//       <MarkdownElement text={docContext('./NodeGroup/README3.md')} />
//       <CodeExample
//         code={docContext('./NodeGroup/Example4')}
//         title="Example 4: Using namespaces in state"
//       >
//         <Example4 />
//       </CodeExample>
//       <MarkdownElement text={docContext('./NodeGroup/README4.md')} />
//     </div>
//   );
// };

NodeGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default NodeGroupDocs;
