// @flow weak

import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import Example1 from './Example1';
import Example2 from './Example2';

class SurfaceDocs extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  render() {
    const { route: { docContext, srcContext } } = this.props;

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
  }
}

export default SurfaceDocs;
