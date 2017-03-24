// @flow weak

import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import Example1 from './Example1';
import Example2 from './Example2';

class TickGroupDocs extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  render() {
    const { route: { docContext, srcContext } } = this.props;

    return (
      <div>
        <Title render={(previousTitle) => `TickGroup - ${previousTitle}`} />
        <MarkdownElement text={docContext('./TickGroup/README.md')} />
        <CodeExample
          code={docContext('./TickGroup/Example1')}
          title="Example 1: Basic Surface"
        >
          <Example1 />
        </CodeExample>
        <CodeExample
          code={docContext('./TickGroup/Example2')}
          title="Example 2: Multiple Surfaces"
        >
          <Example2 />
        </CodeExample>
        <PropTypeDescription code={srcContext('./TickGroup/TickGroup')} />
      </div>
    );
  }
}

export default TickGroupDocs;
