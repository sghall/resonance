// @flow weak

import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

import AppBarExampleIcon from './ExampleIcon';
import AppBarExampleIconButton from './ExampleIconButton';
import AppBarExampleComposition from './ExampleComposition';

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
          code={docContext('./Surface/ExampleIcon')}
          title="Simple example"
        >
          <AppBarExampleIcon />
        </CodeExample>
        <CodeExample
          code={docContext('./Surface/ExampleIconButton')}
          title="Buttons example"
        >
          <AppBarExampleIconButton />
        </CodeExample>
        <CodeExample
          code={docContext('./Surface/ExampleComposition')}
          title="Composition example"
        >
          <AppBarExampleComposition />
        </CodeExample>
        <PropTypeDescription code={srcContext('./Surface/Surface')} />
      </div>
    );
  }
}

export default SurfaceDocs;
